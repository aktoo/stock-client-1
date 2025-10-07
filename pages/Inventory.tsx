import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Package } from 'lucide-react';
import { JerseysList } from '@/components/inventory/JerseysList';
import { AddJerseyDialog } from '@/components/inventory/AddJerseyDialog';
import { ReceiveStockDialog } from '@/components/inventory/ReceiveStockDialog';

export function Inventory() {
  const [showAddDialog, setShowAddDialog] = React.useState(false);
  const [showReceiveDialog, setShowReceiveDialog] = React.useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Inventory Management</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setShowReceiveDialog(true)}>
            <Package className="h-4 w-4 mr-2" />
            Receive Stock
          </Button>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Jersey
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Jersey Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <JerseysList />
        </CardContent>
      </Card>

      <AddJerseyDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog} 
      />
      
      <ReceiveStockDialog 
        open={showReceiveDialog} 
        onOpenChange={setShowReceiveDialog} 
      />
    </div>
  );
}
