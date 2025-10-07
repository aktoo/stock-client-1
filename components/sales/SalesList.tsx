import * as React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useSales } from '@/hooks/useSales';

export function SalesList() {
  const { sales, isLoading, deleteSale } = useSales();

  const handleDelete = async (saleId: number) => {
    if (window.confirm('Are you sure you want to delete this sale? This will revert the stock quantity.')) {
      try {
        await deleteSale(saleId);
      } catch (error) {
        console.error('Failed to delete sale:', error);
        alert('Failed to delete sale.');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-12 bg-muted rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (sales.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No sales recorded yet.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date & Time</TableHead>
          <TableHead>SKU</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Original Price</TableHead>
          <TableHead>Discount</TableHead>
          <TableHead>Sale Price</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sales.map((sale) => (
          <TableRow key={sale.id}>
            <TableCell>
              <div>
                <div>{new Date(sale.timestamp).toLocaleDateString()}</div>
                <div className="text-sm text-muted-foreground">
                  {new Date(sale.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </TableCell>
            <TableCell className="font-mono text-sm">{sale.sku}</TableCell>
            <TableCell>{sale.quantity}</TableCell>
            <TableCell>${sale.original_price.toFixed(2)}</TableCell>
            <TableCell>
              {sale.discount_amount > 0 ? (
                <Badge variant="secondary">-${sale.discount_amount.toFixed(2)}</Badge>
              ) : (
                '-'
              )}
            </TableCell>
            <TableCell>${sale.sale_price.toFixed(2)}</TableCell>
            <TableCell className="font-semibold">
              ${(sale.sale_price * sale.quantity).toFixed(2)}
            </TableCell>
            <TableCell>{sale.customer_name || '-'}</TableCell>
            <TableCell>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleDelete(sale.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
