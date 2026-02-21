import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Image, ChevronLeft, ChevronRight, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GradientCard } from '@/components/ui/GradientCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface ProgressPhoto {
  id: string;
  date: string;
  photo_url: string;
  category: string;
  weight: number | null;
  notes: string | null;
}

const CATEGORIES = [
  { value: 'front', label: 'Front' },
  { value: 'side', label: 'Side' },
  { value: 'back', label: 'Back' },
  { value: 'other', label: 'Other' },
];

export function ProgressPhotos() {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<ProgressPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Form state
  const [category, setCategory] = useState('front');
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) fetchPhotos();
  }, [user]);

  const fetchPhotos = async () => {
    if (!user) return;
    setIsLoading(true);
    const { data } = await supabase
      .from('progress_photos')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });
    setPhotos((data || []) as ProgressPhoto[]);
    setIsLoading(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!user || !selectedFile) return;
    setUploading(true);

    try {
      const fileExt = selectedFile.name.split('.').pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('progress-photos')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('progress-photos')
        .getPublicUrl(filePath);

      // Since bucket is private, we store the path and generate signed URLs
      const { error: insertError } = await supabase.from('progress_photos').insert({
        user_id: user.id,
        date: format(new Date(), 'yyyy-MM-dd'),
        photo_url: filePath,
        category,
        weight: weight ? parseFloat(weight) : null,
        notes: notes || null,
      });

      if (insertError) throw insertError;

      toast({ title: 'Photo saved!' });
      setAddModalOpen(false);
      resetForm();
      fetchPhotos();
    } catch (err: any) {
      toast({ title: 'Upload failed', description: err.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (photo: ProgressPhoto) => {
    await supabase.storage.from('progress-photos').remove([photo.photo_url]);
    await supabase.from('progress_photos').delete().eq('id', photo.id);
    setPhotos(prev => prev.filter(p => p.id !== photo.id));
    toast({ title: 'Photo deleted' });
  };

  const resetForm = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setCategory('front');
    setWeight('');
    setNotes('');
  };

  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadUrls = async () => {
      const urls: Record<string, string> = {};
      for (const photo of photos) {
        const { data } = await supabase.storage
          .from('progress-photos')
          .createSignedUrl(photo.photo_url, 3600);
        if (data?.signedUrl) urls[photo.id] = data.signedUrl;
      }
      setSignedUrls(urls);
    };
    if (photos.length > 0) loadUrls();
  }, [photos]);

  const comparePhotos = photos.length >= 2 ? [photos[photos.length - 1], photos[0]] : [];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Progress Photos</h3>
        </div>
        <div className="flex gap-2">
          {photos.length >= 2 && (
            <Button size="sm" variant="outline" onClick={() => setCompareMode(!compareMode)}>
              {compareMode ? 'Gallery' : 'Compare'}
            </Button>
          )}
          <Button size="sm" onClick={() => setAddModalOpen(true)}>
            <Plus className="w-4 h-4 mr-1" /> Add
          </Button>
        </div>
      </div>

      {/* Side-by-Side Compare */}
      {compareMode && comparePhotos.length === 2 && (
        <GradientCard className="p-4">
          <h4 className="text-sm font-medium text-foreground mb-3 text-center">Before & After</h4>
          <div className="grid grid-cols-2 gap-3">
            {comparePhotos.map((photo, idx) => (
              <div key={photo.id} className="space-y-1">
                <div className="aspect-[3/4] rounded-lg overflow-hidden bg-muted">
                  {signedUrls[photo.id] && (
                    <img src={signedUrls[photo.id]} alt={`Progress ${idx === 0 ? 'Before' : 'After'}`} className="w-full h-full object-cover" />
                  )}
                </div>
                <p className="text-xs text-center text-muted-foreground">{format(new Date(photo.date), 'MMM d, yyyy')}</p>
                {photo.weight && <p className="text-xs text-center font-medium text-foreground">{photo.weight} kg</p>}
              </div>
            ))}
          </div>
        </GradientCard>
      )}

      {/* Gallery Grid */}
      {!compareMode && (
        <div className="grid grid-cols-3 gap-2">
          {photos.map((photo) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-square rounded-lg overflow-hidden bg-muted group"
            >
              {signedUrls[photo.id] ? (
                <img src={signedUrls[photo.id]} alt="Progress" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Image className="w-6 h-6 text-muted-foreground" />
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-1.5">
                <p className="text-[10px] text-white">{format(new Date(photo.date), 'MMM d')}</p>
              </div>
              <button
                onClick={() => handleDelete(photo)}
                className="absolute top-1 right-1 p-1 rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </motion.div>
          ))}
          {photos.length === 0 && !isLoading && (
            <div className="col-span-3 text-center py-8">
              <Camera className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No photos yet. Start capturing your journey!</p>
            </div>
          )}
        </div>
      )}

      {/* Upload Modal */}
      <Dialog open={addModalOpen} onOpenChange={(open) => { setAddModalOpen(open); if (!open) resetForm(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Progress Photo</DialogTitle>
            <DialogDescription>Capture your transformation journey</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <input type="file" accept="image/*" capture="environment" className="hidden" ref={fileInputRef} onChange={handleFileSelect} />
            
            {previewUrl ? (
              <div className="aspect-[3/4] rounded-lg overflow-hidden bg-muted">
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full aspect-[3/4] rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 hover:border-primary/50 transition-colors"
              >
                <Camera className="w-8 h-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Tap to take or select photo</span>
              </button>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Weight (kg)</Label>
                <Input type="number" placeholder="Optional" value={weight} onChange={e => setWeight(e.target.value)} />
              </div>
            </div>

            <div>
              <Label>Notes</Label>
              <Input placeholder="How are you feeling?" value={notes} onChange={e => setNotes(e.target.value)} />
            </div>

            <Button className="w-full" onClick={handleUpload} disabled={!selectedFile || uploading}>
              {uploading ? 'Uploading...' : 'Save Photo'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
