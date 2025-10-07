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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useJerseys } from '@/hooks/useJerseys';
import { useTeams } from '@/hooks/useTeams';

interface AddJerseyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddJerseyDialog({ open, onOpenChange }: AddJerseyDialogProps) {
  const [formData, setFormData] = React.useState({
    team_id: '',
    season: '',
    type: 'Home',
    supplier: '',
    cost_price: '',
    retail_price: '',
    description: '',
  });
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { addJersey } = useJerseys();
  const { teams } = useTeams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.team_id || !formData.season) {
      return;
    }

    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      
      if (selectedFile) {
        formDataToSend.append('image', selectedFile);
      }

      await addJersey(formDataToSend);
      setFormData({
        team_id: '',
        season: '',
        type: 'Home',
        supplier: '',
        cost_price: '',
        retail_price: '',
        description: '',
      });
      setSelectedFile(null);
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding jersey:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Jersey</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Team</Label>
            <Select onValueChange={(value) => handleInputChange('team_id', value)} value={formData.team_id}>
              <SelectTrigger>
                <SelectValue placeholder="Select team" />
              </SelectTrigger>
              <SelectContent>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={team.id.toString()}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="season">Season</Label>
            <Input
              id="season"
              placeholder="e.g., 2023-24, 2024"
              value={formData.season}
              onChange={(e) => handleInputChange('season', e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Type</Label>
            <Select onValueChange={(value) => handleInputChange('type', value)} value={formData.type}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Home">Home</SelectItem>
                <SelectItem value="Away">Away</SelectItem>
                <SelectItem value="Third">Third</SelectItem>
                <SelectItem value="Training">Training</SelectItem>
                <SelectItem value="Retro">Retro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="supplier">Supplier (Optional)</Label>
            <Input
              id="supplier"
              placeholder="e.g., Nike, Adidas"
              value={formData.supplier}
              onChange={(e) => handleInputChange('supplier', e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cost_price">Cost Price</Label>
              <Input
                id="cost_price"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.cost_price}
                onChange={(e) => handleInputChange('cost_price', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="retail_price">Retail Price</Label>
              <Input
                id="retail_price"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.retail_price}
                onChange={(e) => handleInputChange('retail_price', e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="image">Product Image (Optional)</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              placeholder="Additional details..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
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
              {isSubmitting ? 'Adding...' : 'Add Jersey'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
