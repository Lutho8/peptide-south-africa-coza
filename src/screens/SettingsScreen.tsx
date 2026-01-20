import { useState, useRef } from 'react';
import { GradientCard } from '@/components/ui/GradientCard';
import { Button } from '@/components/ui/button';
import { NotificationSettings } from '@/components/settings/NotificationSettings';
import { ProfileEditModal } from '@/components/modals/ProfileEditModal';
import { 
  exportAsJSON, 
  exportBodyCompositionCSV, 
  exportDoseLogsCSV, 
  exportCyclesCSV,
  importFromJSON 
} from '@/services/exportData';
import { getUserProfile } from '@/services/storage';
import { useToast } from '@/hooks/use-toast';
import { 
  User, Bell, Download, Upload, Database, FileJson, FileSpreadsheet,
  Shield, Info, ExternalLink, ChevronRight, Settings2, Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SettingsScreenProps {
  onBack?: () => void;
}

export function SettingsScreen({ onBack }: SettingsScreenProps) {
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profile, setProfile] = useState(getUserProfile());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleExportJSON = () => {
    try {
      exportAsJSON();
      toast({
        title: "Export successful",
        description: "Your data has been exported as JSON.",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Could not export data.",
        variant: "destructive"
      });
    }
  };

  const handleExportCSV = (type: 'body' | 'doses' | 'cycles') => {
    try {
      switch (type) {
        case 'body':
          exportBodyCompositionCSV();
          break;
        case 'doses':
          exportDoseLogsCSV();
          break;
        case 'cycles':
          exportCyclesCSV();
          break;
      }
      toast({
        title: "Export successful",
        description: "Your data has been exported as CSV.",
      });
    } catch (error: any) {
      toast({
        title: "Export failed",
        description: error.message || "No data to export.",
        variant: "destructive"
      });
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await importFromJSON(file);
      toast({
        title: "Import successful",
        description: "Your data has been restored from backup.",
      });
      // Reload to reflect changes
      window.location.reload();
    } catch (error: any) {
      toast({
        title: "Import failed",
        description: error.message || "Could not import data.",
        variant: "destructive"
      });
    }
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClearAllData = () => {
    if (confirm('Are you sure you want to clear ALL data? This cannot be undone.')) {
      localStorage.clear();
      toast({
        title: "Data cleared",
        description: "All data has been removed.",
      });
      window.location.reload();
    }
  };

  const handleProfileUpdate = () => {
    setProfile(getUserProfile());
  };

  return (
    <div className="pb-24 space-y-6 fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center">
          <Settings2 size={24} className="text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground">Manage your preferences and data</p>
        </div>
      </div>

      {/* Profile Section */}
      <div>
        <h2 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">Profile</h2>
        <GradientCard 
          className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => setProfileModalOpen(true)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center text-primary-foreground font-bold">
                {profile?.name.split(' ').map(n => n[0]).join('') || 'U'}
              </div>
              <div>
                <h3 className="font-medium text-foreground">{profile?.name || 'User'}</h3>
                <p className="text-sm text-muted-foreground">
                  {profile?.age} years • {profile?.activityLevel}
                </p>
              </div>
            </div>
            <ChevronRight size={20} className="text-muted-foreground" />
          </div>
        </GradientCard>
      </div>

      {/* Notifications Section */}
      <div>
        <h2 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">Notifications</h2>
        <NotificationSettings />
      </div>

      {/* Data Export Section */}
      <div>
        <h2 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">Data Export</h2>
        <div className="space-y-2">
          <GradientCard className="p-3">
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3 h-auto py-2"
              onClick={handleExportJSON}
            >
              <FileJson size={18} className="text-primary" />
              <div className="text-left">
                <p className="font-medium text-foreground">Full Backup (JSON)</p>
                <p className="text-xs text-muted-foreground">Export all data for backup</p>
              </div>
            </Button>
          </GradientCard>

          <GradientCard className="p-3">
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3 h-auto py-2"
              onClick={() => handleExportCSV('body')}
            >
              <FileSpreadsheet size={18} className="text-green-500" />
              <div className="text-left">
                <p className="font-medium text-foreground">Body Composition (CSV)</p>
                <p className="text-xs text-muted-foreground">Export measurements for analysis</p>
              </div>
            </Button>
          </GradientCard>

          <GradientCard className="p-3">
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3 h-auto py-2"
              onClick={() => handleExportCSV('doses')}
            >
              <FileSpreadsheet size={18} className="text-blue-500" />
              <div className="text-left">
                <p className="font-medium text-foreground">Dose Logs (CSV)</p>
                <p className="text-xs text-muted-foreground">Export dose tracking history</p>
              </div>
            </Button>
          </GradientCard>

          <GradientCard className="p-3">
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3 h-auto py-2"
              onClick={() => handleExportCSV('cycles')}
            >
              <FileSpreadsheet size={18} className="text-violet-500" />
              <div className="text-left">
                <p className="font-medium text-foreground">Cycles (CSV)</p>
                <p className="text-xs text-muted-foreground">Export cycle history</p>
              </div>
            </Button>
          </GradientCard>
        </div>
      </div>

      {/* Data Import Section */}
      <div>
        <h2 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">Data Restore</h2>
        <GradientCard className="p-3">
          <input 
            type="file" 
            accept=".json"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImport}
          />
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 h-auto py-2"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={18} className="text-primary" />
            <div className="text-left">
              <p className="font-medium text-foreground">Restore from Backup</p>
              <p className="text-xs text-muted-foreground">Import JSON backup file</p>
            </div>
          </Button>
        </GradientCard>
      </div>

      {/* Danger Zone */}
      <div>
        <h2 className="text-sm font-medium text-red-400 mb-3 uppercase tracking-wide">Danger Zone</h2>
        <GradientCard className="p-3 border border-red-500/20">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 h-auto py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10"
            onClick={handleClearAllData}
          >
            <Trash2 size={18} />
            <div className="text-left">
              <p className="font-medium">Clear All Data</p>
              <p className="text-xs opacity-70">Permanently delete all stored data</p>
            </div>
          </Button>
        </GradientCard>
      </div>

      {/* About Section */}
      <div>
        <h2 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">About</h2>
        <GradientCard className="p-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Shield size={18} className="text-primary" />
              <div>
                <p className="font-medium text-foreground">Research Use Only</p>
                <p className="text-xs text-muted-foreground">This app is for educational purposes</p>
              </div>
            </div>
            <div className="text-xs text-muted-foreground leading-relaxed border-t border-border/50 pt-3">
              Peptides discussed are research chemicals NOT approved by the FDA for human consumption. 
              Always consult healthcare professionals before use. Monitor bloodwork regularly.
            </div>
          </div>
        </GradientCard>
      </div>

      {/* Version */}
      <div className="text-center text-xs text-muted-foreground">
        <p>Peptide Protocol Manager v1.0.0</p>
        <p className="mt-1">Data stored locally on your device</p>
      </div>

      {/* Profile Edit Modal */}
      <ProfileEditModal 
        open={profileModalOpen}
        onOpenChange={setProfileModalOpen}
        onProfileUpdate={handleProfileUpdate}
      />
    </div>
  );
}
