import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Zap } from 'lucide-react';
import { SalesList } from '@/components/sales/SalesList';
import { ProcessSaleDialog } from '@/components/sales/ProcessSaleDialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { TurboSell } from '@/components/sales/TurboSell';
import { useSales } from '@/hooks/useSales';

export function Sales() {
  const [showSaleDialog, setShowSaleDialog] = React.useState(false);
  const [isTurboMode, setIsTurboMode] = React.useState(false);
  const { refetch } = useSales();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Sales Management</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="turbo-mode"
              checked={isTurboMode}
              onCheckedChange={setIsTurboMode}
            />
            <Label htmlFor="turbo-mode" className="flex items-center space-x-1">
              <Zap className="h-4 w-4 text-primary" />
              <span>Turbo Mode</span>
            </Label>
          </div>
          <Button onClick={() => setShowSaleDialog(true)} disabled={isTurboMode}>
            <Plus className="h-4 w-4 mr-2" />
            Process Sale
          </Button>
        </div>
      </div>

      {isTurboMode && (
        <TurboSell onSaleProcessed={refetch} />
      )}

      <Card>
        <CardHeader>
          <CardTitle>Sales History</CardTitle>
        </CardHeader>
        <CardContent>
          <SalesList />
        </CardContent>
      </Card>

      <ProcessSaleDialog 
        open={showSaleDialog} 
        onOpenChange={setShowSaleDialog} 
      />
    </div>
  );
}
