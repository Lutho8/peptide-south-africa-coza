import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { GradientCard } from '@/components/ui/GradientCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  Upload, FileText, Brain, TrendingUp, TrendingDown, 
  Minus, AlertTriangle, CheckCircle, Loader2, Trash2,
  Camera, Image as ImageIcon, Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { biomarkers, getBiomarkerStatus, biomarkerCategories } from '@/data/bloodwork';
import ReactMarkdown from 'react-markdown';

interface SuggestedPeptide {
  id: string;
  name: string;
  rank: number;
  reason: string;
}

interface ExtractedBiomarker {
  name: string;
  short_name: string;
  value: number;
  unit: string;
  reference_range: string;
  status: 'normal' | 'high' | 'low' | 'critical';
  category: string;
  layman_explanation?: string;
  suggested_peptides?: SuggestedPeptide[];
}

interface LabReport {
  id: string;
  user_id: string;
  uploaded_at: string;
  file_url: string;
  file_name: string;
  report_date: string | null;
  status: string;
  ai_summary: string | null;
  extracted_biomarkers: ExtractedBiomarker[];
  ai_insights: string | null;
}

export function BiomarkerInsights() {
  const { user } = useAuth();
  const [reports, setReports] = useState<LabReport[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedReport, setSelectedReport] = useState<LabReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) loadReports();
  }, [user]);

  const loadReports = async () => {
    if (!user) return;
    setIsLoading(true);
    const { data, error } = await supabase
      .from('lab_reports')
      .select('*')
      .eq('user_id', user.id)
      .order('uploaded_at', { ascending: false });

    if (!error && data) {
      const typed = (data as any[]).map(r => ({
        ...r,
        extracted_biomarkers: Array.isArray(r.extracted_biomarkers) ? r.extracted_biomarkers : [],
      })) as LabReport[];
      setReports(typed);
      if (typed.length > 0 && !selectedReport) setSelectedReport(typed[0]);
    }
    setIsLoading(false);
  };

  const handleFileSelect = async (file: File) => {
    if (!user) { toast.error('Please sign in first'); return; }
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      toast.error('Please upload an image or PDF'); return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File must be under 10MB'); return;
    }

    setIsUploading(true);
    setUploadProgress(10);

    try {
      // Upload file to storage
      const filePath = `${user.id}/${Date.now()}-${file.name}`;
      setUploadProgress(30);
      
      const { error: uploadError } = await supabase.storage
        .from('lab-reports')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      setUploadProgress(50);

      // Create report record
      const { data: report, error: insertError } = await supabase
        .from('lab_reports')
        .insert({
          user_id: user.id,
          file_url: filePath,
          file_name: file.name,
          status: 'pending',
        })
        .select()
        .single();

      if (insertError) throw insertError;
      setUploadProgress(60);

      // Convert to base64 for AI analysis
      const base64 = await fileToBase64(file);
      setUploadProgress(70);

      // Call AI analysis (PDF or image — backend resolves MIME)
      const { data: analysisData, error: analysisError } = await supabase.functions.invoke('analyze-lab-report', {
        body: { reportId: report.id, imageBase64: base64, fileName: file.name, mimeType: file.type },
      });

      setUploadProgress(90);

      if (analysisError) {
        toast.error('AI analysis failed, but your report was saved');
      } else {
        toast.success('Lab report analyzed successfully!');
      }

      setUploadProgress(100);
      await loadReports();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const deleteReport = async (reportId: string) => {
    const report = reports.find(r => r.id === reportId);
    if (!report) return;

    await supabase.storage.from('lab-reports').remove([report.file_url]);
    await supabase.from('lab_reports').delete().eq('id', reportId);
    
    setReports(prev => prev.filter(r => r.id !== reportId));
    if (selectedReport?.id === reportId) setSelectedReport(null);
    toast.success('Report deleted');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal': return <CheckCircle size={14} className="text-green-500" />;
      case 'high': return <TrendingUp size={14} className="text-red-500" />;
      case 'low': return <TrendingDown size={14} className="text-yellow-500" />;
      case 'critical': return <AlertTriangle size={14} className="text-red-600" />;
      default: return <Minus size={14} className="text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'high': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'low': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'critical': return 'bg-red-600/10 text-red-600 border-red-600/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  // Aggregate all biomarkers across reports for trend view
  const getAllBiomarkerTrends = () => {
    const trends: Record<string, { name: string; values: { date: string; value: number; unit: string }[] }> = {};
    
    for (const report of [...reports].reverse()) {
      if (report.status !== 'completed') continue;
      const date = report.report_date || report.uploaded_at.split('T')[0];
      
      for (const bm of report.extracted_biomarkers) {
        const key = bm.short_name.toLowerCase();
        if (!trends[key]) trends[key] = { name: bm.name, values: [] };
        trends[key].values.push({ date, value: bm.value, unit: bm.unit });
      }
    }
    
    return Object.entries(trends).filter(([, v]) => v.values.length >= 1);
  };

  if (!user) {
    return (
      <GradientCard className="p-6 text-center">
        <Brain size={32} className="mx-auto text-primary mb-3" />
        <h3 className="font-semibold text-foreground mb-1">Biomarker Insights</h3>
        <p className="text-sm text-muted-foreground">Sign in to upload lab reports and get AI-powered analysis</p>
      </GradientCard>
    );
  }

  return (
    <div className="space-y-4">
      {/* Upload Section */}
      <GradientCard variant="primary" className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <Sparkles size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">AI Biomarker Insights</h3>
            <p className="text-xs text-muted-foreground">Upload lab results → AI extracts & analyzes</p>
          </div>
        </div>

        {isUploading ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Loader2 size={16} className="animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">
                {uploadProgress < 50 ? 'Uploading...' : uploadProgress < 80 ? 'AI analyzing...' : 'Finalizing...'}
              </span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </div>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 gap-2"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={16} />
              Upload File
            </Button>
            <Button
              variant="outline"
              className="flex-1 gap-2"
              onClick={() => cameraInputRef.current?.click()}
            >
              <Camera size={16} />
              Take Photo
            </Button>
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,application/pdf"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
        />
        
        <p className="text-xs text-muted-foreground mt-2">
          Supports PDF & images (JPG, PNG) in English or German · up to 10MB · explained in plain English with peptide suggestions
        </p>
      </GradientCard>

      {/* Reports & Analysis */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="animate-spin text-primary" />
        </div>
      ) : reports.length === 0 ? (
        <GradientCard className="p-6 text-center">
          <FileText size={32} className="mx-auto text-muted-foreground mb-3" />
          <h4 className="font-medium text-foreground mb-1">No lab reports yet</h4>
          <p className="text-sm text-muted-foreground">
            Upload your bloodwork results and AI will extract biomarker values, identify trends, and provide insights
          </p>
        </GradientCard>
      ) : (
        <Tabs defaultValue="latest" className="space-y-3">
          <TabsList className="w-full">
            <TabsTrigger value="latest" className="flex-1">Latest</TabsTrigger>
            <TabsTrigger value="trends" className="flex-1">Trends</TabsTrigger>
            <TabsTrigger value="history" className="flex-1">History</TabsTrigger>
          </TabsList>

          {/* Latest Report Tab */}
          <TabsContent value="latest" className="space-y-3">
            {selectedReport && selectedReport.status === 'completed' ? (
              <>
                {/* AI Summary */}
                {selectedReport.ai_summary && (
                  <GradientCard className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain size={16} className="text-primary" />
                      <h4 className="text-sm font-medium text-foreground">AI Summary</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{selectedReport.ai_summary}</p>
                    {selectedReport.report_date && (
                      <p className="text-xs text-muted-foreground/60 mt-2">
                        Report date: {selectedReport.report_date}
                      </p>
                    )}
                  </GradientCard>
                )}

                {/* Extracted Biomarkers */}
                <div className="space-y-2">
                  {selectedReport.extracted_biomarkers.map((bm, i) => (
                    <GradientCard key={i} className="p-3">
                      <div className="flex items-start justify-between mb-1.5">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-semibold text-foreground truncate">{bm.name}</span>
                            <span className="text-[10px] text-muted-foreground">({bm.short_name})</span>
                          </div>
                          <div className="flex items-baseline gap-1.5 mt-0.5">
                            <span className="text-lg font-bold text-foreground">{bm.value}</span>
                            <span className="text-xs text-muted-foreground">{bm.unit}</span>
                            <span className="text-[10px] text-muted-foreground/70">· Ref: {bm.reference_range}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {getStatusIcon(bm.status)}
                          <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0", getStatusColor(bm.status))}>
                            {bm.status}
                          </Badge>
                        </div>
                      </div>

                      {bm.layman_explanation && (
                        <p className="text-xs text-muted-foreground mt-1 leading-snug">
                          {bm.layman_explanation}
                        </p>
                      )}

                      {bm.suggested_peptides && bm.suggested_peptides.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-border/50">
                          <div className="flex items-center gap-1 mb-1.5">
                            <Sparkles size={11} className="text-primary" />
                            <span className="text-[10px] font-semibold uppercase tracking-wide text-primary">
                              Suggested peptides (research-only)
                            </span>
                          </div>
                          <ol className="space-y-1">
                            {[...bm.suggested_peptides]
                              .sort((a, b) => a.rank - b.rank)
                              .map((p) => (
                                <li key={p.id} className="flex gap-2 text-xs">
                                  <span className="shrink-0 w-4 h-4 rounded-full bg-primary/15 text-primary font-bold text-[10px] flex items-center justify-center">
                                    {p.rank}
                                  </span>
                                  <div className="flex-1 min-w-0">
                                    <span className="font-semibold text-foreground">{p.name}</span>
                                    <span className="text-muted-foreground"> — {p.reason}</span>
                                  </div>
                                </li>
                              ))}
                          </ol>
                        </div>
                      )}
                    </GradientCard>
                  ))}
                </div>

                {/* AI Insights */}
                {selectedReport.ai_insights && (
                  <GradientCard className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles size={16} className="text-primary" />
                      <h4 className="text-sm font-medium text-foreground">AI Insights</h4>
                    </div>
                    <div className="text-sm text-muted-foreground prose prose-sm max-w-none dark:prose-invert">
                      <ReactMarkdown>{selectedReport.ai_insights}</ReactMarkdown>
                    </div>
                  </GradientCard>
                )}
              </>
            ) : selectedReport?.status === 'processing' ? (
              <GradientCard className="p-6 text-center">
                <Loader2 size={24} className="mx-auto animate-spin text-primary mb-2" />
                <p className="text-sm text-muted-foreground">AI is analyzing your lab report...</p>
              </GradientCard>
            ) : selectedReport?.status === 'failed' ? (
              <GradientCard className="p-6 text-center">
                <AlertTriangle size={24} className="mx-auto text-red-500 mb-2" />
                <p className="text-sm text-muted-foreground">{selectedReport.ai_summary || 'Analysis failed. Try uploading again.'}</p>
              </GradientCard>
            ) : null}
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-3">
            {getAllBiomarkerTrends().length === 0 ? (
              <GradientCard className="p-6 text-center">
                <TrendingUp size={24} className="mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Upload multiple lab reports to see biomarker trends over time</p>
              </GradientCard>
            ) : (
              getAllBiomarkerTrends().map(([key, trend]) => (
                <GradientCard key={key} className="p-4">
                  <h4 className="text-sm font-medium text-foreground mb-2">{trend.name}</h4>
                  <div className="space-y-1">
                    {trend.values.map((v, i) => {
                      const prev = i > 0 ? trend.values[i - 1].value : null;
                      const change = prev ? ((v.value - prev) / prev * 100).toFixed(1) : null;
                      return (
                        <div key={i} className="flex items-center justify-between text-sm">
                          <span className="text-xs text-muted-foreground">{v.date}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">{v.value} {v.unit}</span>
                            {change && (
                              <span className={cn("text-xs", parseFloat(change) > 0 ? "text-red-400" : "text-green-400")}>
                                {parseFloat(change) > 0 ? '+' : ''}{change}%
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </GradientCard>
              ))
            )}
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-2">
            {reports.map(report => (
              <GradientCard
                key={report.id}
                hover
                onClick={() => setSelectedReport(report)}
                className={cn("p-3 cursor-pointer", selectedReport?.id === report.id && "ring-1 ring-primary")}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{report.file_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(report.uploaded_at).toLocaleDateString()} · {report.extracted_biomarkers.length} biomarkers
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={cn("text-[10px]",
                      report.status === 'completed' ? 'text-green-500' :
                      report.status === 'processing' ? 'text-yellow-500' :
                      report.status === 'failed' ? 'text-red-500' : 'text-muted-foreground'
                    )}>
                      {report.status}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={(e) => { e.stopPropagation(); deleteReport(report.id); }}
                    >
                      <Trash2 size={14} className="text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              </GradientCard>
            ))}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
