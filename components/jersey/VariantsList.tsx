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
import { AlertTriangle, Trash2, QrCode } from 'lucide-react';
import { useVariants } from '@/hooks/useVariants';

interface VariantsListProps {
  jerseyId: number;
}

export function VariantsList({ jerseyId }: VariantsListProps) {
  const { variants, isLoading, deleteVariant } = useVariants(jerseyId);

  const handleDelete = async (id: number, sku: string) => {
    if (window.confirm(`Are you sure you want to delete variant with SKU "${sku}"? This action cannot be undone.`)) {
      try {
        await deleteVariant(id);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to delete variant.';
        alert(errorMessage);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 bg-muted rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (variants.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No size variants added yet. Add your first variant to get started.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Size</TableHead>
          <TableHead>SKU</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {variants.map((variant) => (
          <TableRow key={variant.id}>
            <TableCell className="font-medium">{variant.size}</TableCell>
            <TableCell className="font-mono text-sm">{variant.sku}</TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                <span className="font-semibold">{variant.stock_quantity}</span>
                {variant.stock_quantity <= variant.low_stock_threshold && (
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                )}
              </div>
            </TableCell>
            <TableCell>
              {variant.stock_quantity === 0 ? (
                <Badge variant="secondary">Out of Stock</Badge>
              ) : variant.stock_quantity <= variant.low_stock_threshold ? (
                <Badge variant="destructive">Low Stock</Badge>
              ) : (
                <Badge variant="default">In Stock</Badge>
              )}
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline">
                  <QrCode className="h-4 w-4 mr-2" />
                  QR Code
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(variant.id, variant.sku)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
