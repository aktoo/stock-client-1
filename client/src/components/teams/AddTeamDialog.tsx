import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTeams } from '@/hooks/useTeams';

interface AddTeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddTeamDialog({ open, onOpenChange }: AddTeamDialogProps) {
  const [formData, setFormData] = React.useState({
    name: '',
    league: '',
    country: '',
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { addTeam } = useTeams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      return;
    }

    setIsSubmitting(true);
    try {
      await addTeam(formData);
      setFormData({ name: '', league: '', country: '' });
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding team:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Team</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Team Name</Label>
            <Input
              id="name"
              placeholder="Enter team name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="league">League (Optional)</Label>
            <Input
              id="league"
              placeholder="e.g., Premier League, Serie A"
              value={formData.league}
              onChange={(e) => handleInputChange('league', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="country">Country (Optional)</Label>
            <Input
              id="country"
              placeholder="e.g., England, Italy"
              value={formData.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Team'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
