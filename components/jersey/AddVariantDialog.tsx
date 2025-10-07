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
import { useVariants } from '@/hooks/useVariants';
import { generateSku } from '@/lib/sku';

interface JerseyForSku {
  team_name: string;
  season: string;
  type: string;
}

interface AddVariantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jerseyId: number;
  jersey: JerseyForSku;
}

export function AddVariantDialog({ open, onOpenChange, jerseyId, jersey }: AddVariantDialogProps) {
  const [formData, setFormData] = React.useState({
    size: '',
    sleeve: 'H', // Default to Half Sleeve
    sku: '',
    stock_quantity: '0',
    low_stock_threshold: '5',
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { addVariant } = useVariants(jerseyId);

  React.useEffect(() => {
    if (formData.size && formData.sleeve && jersey) {
      const newSku = generateSku(jersey, formData.size, formData.sleeve);
      setFormData(prev => ({ ...prev, sku: newSku }));
    } else {
      setFormData(prev => ({ ...prev, sku: '' }));
    }
  }, [formData.size, formData.sleeve, jersey]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.size || !formData.sku) {
      return;
    }

    setIsSubmitting(true);
    try {
      await addVariant({
        jersey_id: jerseyId,
        size: formData.size,
        sleeve: formData.sleeve,
        sku: formData.sku,
        stock_quantity: parseInt(formData.stock_quantity) || 0,
        low_stock_threshold: parseInt(formData.low_stock_threshold) || 5,
      });
      setFormData({ size: '', sleeve: 'H', sku: '', stock_quantity: '0', low_stock_threshold: '5' });
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding variant:', error);
      alert('Failed to add variant. Please check if the SKU already exists.');
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
          <DialogTitle>Add Size Variant</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Size</Label>
              <Select onValueChange={(value) => handleInputChange('size', value)} value={formData.size}>
                <SelectTrigger>
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="XS">XS</SelectItem>
                  <SelectItem value="S">S</SelectItem>
                  <SelectItem value="M">M</SelectItem>
                  <SelectItem value="L">L</SelectItem>
                  <SelectItem value="XL">XL</SelectItem>
                  <SelectItem value="XXL">XXL</SelectItem>
                  <SelectItem value="XXXL">XXXL</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Sleeve</Label>
              <Select onValueChange={(value) => handleInputChange('sleeve', value)} value={formData.sleeve}>
                <SelectTrigger>
                  <SelectValue placeholder="Select sleeve type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="H">Half Sleeve</SelectItem>
                  <SelectItem value="F">Full Sleeve</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="sku">SKU</Label>
            <Input
              id="sku"
              placeholder="Generated automatically"
              value={formData.sku}
              readOnly
              className="bg-muted/50"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="stock_quantity">Initial Stock Quantity</Label>
            <Input
              id="stock_quantity"
              type="number"
              min="0"
              value={formData.stock_quantity}
              onChange={(e) => handleInputChange('stock_quantity', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="low_stock_threshold">Low Stock Threshold</Label>
            <Input
              id="low_stock_threshold"
              type="number"
              min="0"
              value={formData.low_stock_threshold}
              onChange={(e) => handleInputChange('low_stock_threshold', e.target.value)}
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
            <Button type="submit" disabled={isSubmitting || !formData.sku}>
              {isSubmitting ? 'Adding...' : 'Add Variant'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
