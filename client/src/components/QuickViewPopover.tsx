import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Package } from 'lucide-react';

interface QuickViewData {
  id: number;
  jersey_id?: number;
  size: string;
  sku: string;
  stock_quantity: number;
  low_stock_threshold: number;
  jersey_name: string;
  season: string;
  type: string;
  retail_price: number;
  image_path: string | null;
  team_name: string;
  total_jersey_stock: number;
  is_low_stock: boolean;
}

interface QuickViewPopoverProps {
  sku: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuickViewPopover({ sku, open, onOpenChange }: QuickViewPopoverProps) {
  const [data, setData] = React.useState<QuickViewData | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (open && sku.trim()) {
      fetchQuickView();
    }
  }, [open, sku]);

  const fetchQuickView = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/quickview/${encodeURIComponent(sku.trim())}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Product not found');
        }
        throw new Error('Failed to fetch product info');
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = () => {
    if (data) {
      // Navigate to jersey detail using jersey_id if available, or fall back to variant id
      const jerseyId = data.jersey_id || data.id;
      navigate(`/jerseys/${jerseyId}`);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Quick View - {sku}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {isLoading && (
            <div className="text-center py-4">
              <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
            </div>
          )}
          
          {error && (
            <div className="text-center py-4">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
          
          {data && (
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                {data.image_path ? (
                  <img 
                    src={`/images/${data.image_path}`} 
                    alt={data.jersey_name}
                    className="w-24 h-24 object-cover rounded-md border"
                  />
                ) : (
                  <div className="w-24 h-24 bg-muted rounded-md flex items-center justify-center">
                    <Package className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                
                <div className="flex-1 space-y-2">
                  <h3 className="font-semibold">{data.team_name} {data.jersey_name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {data.season} • {data.type} • Size {data.size}
                  </p>
                  <p className="font-medium">${data.retail_price.toFixed(2)}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">This Size Stock</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-2xl font-bold">{data.stock_quantity}</p>
                    {data.is_low_stock && (
                      <Badge variant="destructive" className="flex items-center space-x-1">
                        <AlertTriangle className="h-3 w-3" />
                        <span>Low</span>
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium">Total Jersey Stock</p>
                  <p className="text-2xl font-bold">{data.total_jersey_stock}</p>
                </div>
              </div>
              
              <Button onClick={handleViewDetails} className="w-full">
                View Full Details
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
