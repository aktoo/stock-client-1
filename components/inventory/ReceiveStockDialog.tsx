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

interface ReceiveStockDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReceiveStockDialog({ open, onOpenChange }: ReceiveStockDialogProps) {
  const [sku, setSku] = React.useState('');
  const [quantity, setQuantity] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sku || !quantity) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/stock/receive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sku: sku.trim(),
          quantity: parseInt(quantity),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || 'Failed to receive stock');
        return;
      }

      setSku('');
      setQuantity('');
      onOpenChange(false);
      alert('Stock received successfully!');
      // Optionally refresh the page or emit an event to update inventory
      window.location.reload();
    } catch (error) {
      console.error('Error receiving stock:', error);
      alert('Failed to receive stock');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Receive Stock</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sku">SKU</Label>
            <Input
              id="sku"
              placeholder="Scan or enter SKU"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity Received</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              placeholder="Enter quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
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
              {isSubmitting ? 'Receiving...' : 'Receive Stock'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
