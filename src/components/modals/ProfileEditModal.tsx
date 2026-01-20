import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { GradientCard } from '@/components/ui/GradientCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getUserProfile, saveUserProfile, UserProfile } from '@/services/storage';
import { useToast } from '@/hooks/use-toast';
import { Save, User } from 'lucide-react';

interface ProfileEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProfileUpdate?: () => void;
}

export function ProfileEditModal({ open, onOpenChange, onProfileUpdate }: ProfileEditModalProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [goals, setGoals] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      const currentProfile = getUserProfile();
      setProfile(currentProfile);
      setGoals(currentProfile?.goals.join('\n') || '');
    }
  }, [open]);

  const handleSave = () => {
    if (!profile) return;

    const updatedProfile: UserProfile = {
      ...profile,
      goals: goals.split('\n').filter(g => g.trim() !== ''),
    };

    saveUserProfile(updatedProfile);
    
    toast({
      title: "Profile updated",
      description: "Your profile has been saved successfully.",
    });

    onProfileUpdate?.();
    onOpenChange(false);
  };

  if (!profile) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <User size={20} />
            Edit Profile
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Basic Info */}
          <GradientCard className="space-y-4">
            <h3 className="font-medium text-foreground">Basic Information</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 space-y-1">
                <Label className="text-xs">Name</Label>
                <Input 
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="bg-muted"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Age</Label>
                <Input 
                  type="number"
                  value={profile.age}
                  onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) || 0 })}
                  className="bg-muted"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Gender</Label>
                <Select
                  value={profile.gender}
                  onValueChange={(value: 'male' | 'female') => setProfile({ ...profile, gender: value })}
                >
                  <SelectTrigger className="bg-muted">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </GradientCard>

          {/* Physical Stats */}
          <GradientCard className="space-y-4">
            <h3 className="font-medium text-foreground">Physical Stats</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Height (cm)</Label>
                <Input 
                  type="number"
                  value={profile.height}
                  onChange={(e) => setProfile({ ...profile, height: parseInt(e.target.value) || 0 })}
                  className="bg-muted"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Weight (kg)</Label>
                <Input 
                  type="number"
                  step="0.1"
                  value={profile.weight}
                  onChange={(e) => setProfile({ ...profile, weight: parseFloat(e.target.value) || 0 })}
                  className="bg-muted"
                />
              </div>
            </div>
          </GradientCard>

          {/* Experience */}
          <GradientCard className="space-y-4">
            <h3 className="font-medium text-foreground">Experience Level</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Activity Level</Label>
                <Select
                  value={profile.activityLevel}
                  onValueChange={(value: UserProfile['activityLevel']) => setProfile({ ...profile, activityLevel: value })}
                >
                  <SelectTrigger className="bg-muted">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentary</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="athlete">Athlete</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Peptide Experience</Label>
                <Select
                  value={profile.experience}
                  onValueChange={(value: UserProfile['experience']) => setProfile({ ...profile, experience: value })}
                >
                  <SelectTrigger className="bg-muted">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </GradientCard>

          {/* Goals */}
          <GradientCard className="space-y-4">
            <h3 className="font-medium text-foreground">Goals</h3>
            <div className="space-y-1">
              <Label className="text-xs">Enter each goal on a new line</Label>
              <Textarea 
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                placeholder="Reduce body fat from 19% to 15%&#10;Maintain muscle mass at 81kg+&#10;Optimize metabolic health"
                className="bg-muted min-h-[100px]"
              />
            </div>
          </GradientCard>

          {/* Save Button */}
          <Button className="w-full gap-2" onClick={handleSave}>
            <Save size={16} />
            Save Profile
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
