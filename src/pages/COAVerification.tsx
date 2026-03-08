import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Search, ExternalLink, FlaskConical, CheckCircle2, Filter, Award, Percent, FileCheck } from 'lucide-react';
import { useCountUp } from '@/hooks/useCountUp';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { peptides, categoryConfig } from '@/data/peptides';
import type { PeptideCategory } from '@/data/peptides';

export default function COAVerification() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PeptideCategory | 'all'>('all');

  const testedPeptides = useMemo(() => {
    return peptides
      .filter(p => p.janoshikTested && p.janoshikCOA && p.janoshikCOA.length > 0)
      .filter(p => {
        if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
        if (search) {
          const q = search.toLowerCase();
          return (
            p.name.toLowerCase().includes(q) ||
            p.shortName.toLowerCase().includes(q) ||
            p.janoshikCOA!.some(c => c.sampleName.toLowerCase().includes(q) || c.verifyKey.toLowerCase().includes(q))
          );
        }
        return true;
      })
      .sort((a, b) => (b.janoshikCOA?.length || 0) - (a.janoshikCOA?.length || 0));
  }, [search, selectedCategory]);

  const allTestedPeptides = useMemo(() => {
    return peptides.filter(p => p.janoshikTested && p.janoshikCOA && p.janoshikCOA.length > 0);
  }, []);

  const totalCOAs = allTestedPeptides.reduce((sum, p) => sum + (p.janoshikCOA?.length || 0), 0);

  const avgPurity = useMemo(() => {
    const purities = allTestedPeptides
      .filter(p => p.janoshikPurity)
      .map(p => p.janoshikPurity!);
    return purities.length ? purities.reduce((a, b) => a + b, 0) / purities.length : 0;
  }, [allTestedPeptides]);

  const peptideCount = useCountUp({ end: allTestedPeptides.length, duration: 1500, enableScrollTrigger: true });
  const coaCount = useCountUp({ end: totalCOAs, duration: 1800, delay: 200, enableScrollTrigger: true });
  const purityCount = useCountUp({ end: avgPurity, duration: 2000, delay: 400, decimals: 1, suffix: '%', enableScrollTrigger: true });

  const categories = useMemo(() => {
    const cats = new Set<PeptideCategory>();
    peptides.filter(p => p.janoshikTested && p.janoshikCOA?.length).forEach(p => cats.add(p.category));
    return Array.from(cats);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                <h1 className="text-xl font-bold text-foreground">COA Verification</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-primary border-primary">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                {testedPeptides.length} Peptides
              </Badge>
              <Badge variant="outline">
                {totalCOAs} Certificates
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-6xl space-y-6">
        {/* Info banner */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <FlaskConical className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-foreground mb-1">Independent Third-Party Testing by Janoshik Analytical</p>
                <p className="text-muted-foreground">
                  All peptides listed below have been independently tested for identity and purity. Each certificate includes a unique verification key that can be verified at{' '}
                  <a href="https://www.janoshik.com/verify/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    janoshik.com/verify
                  </a>.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="text-center p-4">
            <div ref={peptideCount.ref} className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-1">
                <FlaskConical className="w-5 h-5 text-primary" />
              </div>
              <span className="text-2xl font-bold text-foreground">{peptideCount.count}</span>
              <span className="text-[11px] text-muted-foreground leading-tight">Peptides Tested</span>
            </div>
          </Card>
          <Card className="text-center p-4">
            <div ref={purityCount.ref} className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center mb-1">
                <Award className="w-5 h-5 text-emerald-500" />
              </div>
              <span className="text-2xl font-bold text-foreground">{purityCount.formattedValue}</span>
              <span className="text-[11px] text-muted-foreground leading-tight">Avg Purity</span>
            </div>
          </Card>
          <Card className="text-center p-4">
            <div ref={coaCount.ref} className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mb-1">
                <FileCheck className="w-5 h-5 text-blue-500" />
              </div>
              <span className="text-2xl font-bold text-foreground">{coaCount.count}</span>
              <span className="text-[11px] text-muted-foreground leading-tight">Certificates</span>
            </div>
          </Card>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search peptide or verification key..."
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-all whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-input bg-background text-muted-foreground hover:bg-muted'
              }`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-input bg-background text-muted-foreground hover:bg-muted'
                }`}
              >
                {categoryConfig[cat]?.label || cat}
              </button>
            ))}
          </div>
        </div>

        {/* Peptide COA Cards */}
        <div className="space-y-4">
          {testedPeptides.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FlaskConical className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No matching peptides found</p>
            </div>
          ) : (
            testedPeptides.map(peptide => (
              <Card key={peptide.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-lg">{peptide.shortName}</CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        {categoryConfig[peptide.category]?.label}
                      </Badge>
                      {peptide.janoshikPurity && (
                        <Badge className="bg-primary/10 text-primary border-primary/20">
                          {peptide.janoshikPurity}% Pure
                        </Badge>
                      )}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {peptide.janoshikCOA!.length} COA{peptide.janoshikCOA!.length > 1 ? 's' : ''}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{peptide.name}</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {peptide.janoshikCOA!.map((coa, i) => (
                      <div
                        key={i}
                        className="border border-border rounded-lg p-3 bg-muted/20 space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-foreground">{coa.sampleName}</span>
                          <span className="text-muted-foreground">{coa.testDate}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-1 text-muted-foreground">
                          <span>Amount: <span className="text-foreground font-medium">{coa.measuredAmount}</span></span>
                          {coa.purity && (
                            <span>Purity: <span className="text-foreground font-medium">{coa.purity}</span></span>
                          )}
                          <span>Task: <span className="text-foreground font-mono">{coa.taskNumber}</span></span>
                          <span>Mfg: <span className="text-foreground">ZZTai-Tech</span></span>
                        </div>
                        {coa.verifyKey && (
                          <a
                            href="https://www.janoshik.com/verify/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-primary hover:underline text-xs mt-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Verify: {coa.verifyKey}
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
