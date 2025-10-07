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
import { useSales } from '@/hooks/useSales';

interface ProcessSaleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProcessSaleDialog({ open, onOpenChange }: ProcessSaleDialogProps) {
  const [formData, setFormData] = React.useState({
    sku: '',
    quantity: '1',
    discount_amount: '',
    customer_name: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { refetch } = useSales();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.sku || !formData.quantity) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/sales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sku: formData.sku.trim(),
          quantity: parseInt(formData.quantity),
          discount_amount: parseFloat(formData.discount_amount) || 0,
          customer_name: formData.customer_name.trim() || null,
          notes: formData.notes.trim() || null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || 'Failed to process sale');
        return;
      }

      setFormData({
        sku: '',
        quantity: '1',
        discount_amount: '',
        customer_name: '',
        notes: '',
      });
      onOpenChange(false);
      refetch(); // Refresh the sales list
      alert('Sale processed successfully!');
    } catch (error) {
      console.error('Error processing sale:', error);
      alert('Failed to process sale');
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
          <DialogTitle>Process Sale</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sku">SKU</Label>
            <Input
              id="sku"
              placeholder="Scan or enter SKU"
              value={formData.sku}
              onChange={(e) => handleInputChange('sku', e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) => handleInputChange('quantity', e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="discount_amount">Discount Amount (Optional)</Label>
            <Input
              id="discount_amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.discount_amount}
              onChange={(e) => handleInputChange('discount_amount', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="customer_name">Customer Name (Optional)</Label>
            <Input
              id="customer_name"
              placeholder="Enter customer name"
              value={formData.customer_name}
              onChange={(e) => handleInputChange('customer_name', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Input
              id="notes"
              placeholder="Additional notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
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
              {isSubmitting ? 'Processing...' : 'Process Sale'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
