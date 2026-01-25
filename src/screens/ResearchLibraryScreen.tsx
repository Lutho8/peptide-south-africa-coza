import { useState, useMemo } from 'react';
import { researchReferences, ResearchReference } from '@/data/researchReferences';
import { peptides, getCategoryLabel } from '@/data/peptides';
import { GradientCard } from '@/components/ui/GradientCard';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, ExternalLink, BookOpen, FlaskConical, Calendar, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

type FilterOption = 'all' | string;

export function ResearchLibraryScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [peptideFilter, setPeptideFilter] = useState<FilterOption>('all');
  const [topicFilter, setTopicFilter] = useState<FilterOption>('all');

  // Get unique peptides that have research
  const peptideOptions = useMemo(() => {
    const uniquePeptideIds = new Set<string>();
    researchReferences.forEach(ref => {
      ref.peptideIds.forEach(id => uniquePeptideIds.add(id));
    });
    return Array.from(uniquePeptideIds).map(id => {
      const peptide = peptides.find(p => p.id === id);
      return { id, name: peptide?.shortName || id.toUpperCase() };
    });
  }, []);

  // Get unique topics/categories
  const topicOptions = useMemo(() => {
    const topics = new Set<string>();
    researchReferences.forEach(ref => {
      ref.peptideIds.forEach(id => {
        const peptide = peptides.find(p => p.id === id);
        if (peptide) topics.add(peptide.category);
      });
    });
    return Array.from(topics).map(cat => ({
      id: cat,
      name: getCategoryLabel(cat as any)
    }));
  }, []);

  const filteredReferences = useMemo(() => {
    return researchReferences.filter(ref => {
      // Search filter
      const matchesSearch = searchQuery === '' || 
        ref.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ref.authors.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ref.journal.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ref.keyFindings.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));

      // Peptide filter
      const matchesPeptide = peptideFilter === 'all' || ref.peptideIds.includes(peptideFilter);

      // Topic filter
      const matchesTopic = topicFilter === 'all' || ref.peptideIds.some(id => {
        const peptide = peptides.find(p => p.id === id);
        return peptide?.category === topicFilter;
      });

      return matchesSearch && matchesPeptide && matchesTopic;
    });
  }, [searchQuery, peptideFilter, topicFilter]);

  const getPeptideNames = (peptideIds: string[]) => {
    return peptideIds.map(id => {
      const peptide = peptides.find(p => p.id === id);
      return peptide?.shortName || id.toUpperCase();
    });
  };

  const getJournalColor = (journal: string) => {
    if (journal.toLowerCase().includes('nature')) return 'bg-emerald-500/20 text-emerald-400';
    if (journal.toLowerCase().includes('cell')) return 'bg-blue-500/20 text-blue-400';
    if (journal.toLowerCase().includes('pubmed') || journal.toLowerCase().includes('journal')) return 'bg-amber-500/20 text-amber-400';
    return 'bg-muted text-muted-foreground';
  };

  return (
    <div className="pb-24 space-y-4 fade-in">
      <div className="flex items-center gap-3 mb-2">
        <BookOpen className="text-primary" size={28} />
        <h1 className="text-2xl font-bold text-foreground">Research Library</h1>
      </div>
      <p className="text-sm text-muted-foreground">
        {researchReferences.length} peer-reviewed papers from PubMed, Nature, and Cell
      </p>

      {/* Search Bar */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search papers, authors, or findings..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-card border-border"
        />
      </div>

      {/* Peptide Filter */}
      <div className="space-y-2">
        <span className="text-xs text-muted-foreground font-medium">Filter by Peptide:</span>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          <button
            onClick={() => setPeptideFilter('all')}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all",
              peptideFilter === 'all'
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground hover:bg-muted"
            )}
          >
            All Peptides
          </button>
          {peptideOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setPeptideFilter(opt.id)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all",
                peptideFilter === opt.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:bg-muted"
              )}
            >
              {opt.name}
            </button>
          ))}
        </div>
      </div>

      {/* Topic Filter */}
      <div className="space-y-2">
        <span className="text-xs text-muted-foreground font-medium">Filter by Topic:</span>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          <button
            onClick={() => setTopicFilter('all')}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all",
              topicFilter === 'all'
                ? "bg-secondary text-secondary-foreground"
                : "bg-card text-muted-foreground hover:bg-muted"
            )}
          >
            All Topics
          </button>
          {topicOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setTopicFilter(opt.id)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all",
                topicFilter === opt.id
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-card text-muted-foreground hover:bg-muted"
              )}
            >
              {opt.name}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredReferences.length} of {researchReferences.length} papers
      </div>

      {/* Research Cards */}
      <div className="space-y-4">
        {filteredReferences.map((ref) => (
          <GradientCard key={ref.id} className="space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground text-sm leading-tight mb-2">
                  {ref.title}
                </h3>
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <Users size={12} />
                  <span className="truncate">{ref.authors}</span>
                </div>
              </div>
              <a
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                <ExternalLink size={16} />
              </a>
            </div>

            {/* Journal & Year */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge className={cn("text-xs", getJournalColor(ref.journal))}>
                {ref.journal}
              </Badge>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar size={12} />
                <span>{ref.year}</span>
              </div>
              {ref.pmid && (
                <span className="text-xs text-muted-foreground">PMID: {ref.pmid}</span>
              )}
            </div>

            {/* Peptides */}
            <div className="flex flex-wrap gap-1.5">
              {getPeptideNames(ref.peptideIds).map((name, idx) => (
                <Badge key={idx} variant="outline" className="text-xs bg-primary/5 border-primary/30 text-primary">
                  <FlaskConical size={10} className="mr-1" />
                  {name}
                </Badge>
              ))}
            </div>

            {/* Key Findings */}
            <div className="space-y-2 pt-2 border-t border-border/50">
              <span className="text-xs font-medium text-foreground">Key Findings:</span>
              <ul className="space-y-1.5">
                {ref.keyFindings.slice(0, 4).map((finding, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{finding}</span>
                  </li>
                ))}
                {ref.keyFindings.length > 4 && (
                  <li className="text-xs text-primary">
                    +{ref.keyFindings.length - 4} more findings...
                  </li>
                )}
              </ul>
            </div>

            {/* Dosage Info */}
            {ref.dosageInfo && (
              <div className="pt-2 border-t border-border/50">
                <span className="text-xs font-medium text-foreground">Dosage Info: </span>
                <span className="text-xs text-muted-foreground">{ref.dosageInfo}</span>
              </div>
            )}
          </GradientCard>
        ))}
      </div>

      {filteredReferences.length === 0 && (
        <div className="text-center py-12">
          <BookOpen size={48} className="mx-auto text-muted-foreground/50 mb-3" />
          <p className="text-muted-foreground">No research papers found matching your criteria</p>
        </div>
      )}
    </div>
  );
}
