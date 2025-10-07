import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';
import { useLowStockAlerts } from '@/hooks/useLowStockAlerts';

export function LowStockAlerts() {
  const { alerts, isLoading } = useLowStockAlerts();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          <span>Low Stock Alerts</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-muted rounded animate-pulse" />
            ))}
          </div>
        ) : alerts.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            All items are well stocked!
          </p>
        ) : (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {alerts.map((alert) => (
              <div 
                key={alert.sku} 
                className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg"
              >
                <div>
                  <p className="font-medium text-sm">
                    {alert.team_name} {alert.jersey_name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Size {alert.size} • SKU: {alert.sku}
                  </p>
                </div>
                <Badge variant="destructive">
                  {alert.stock_quantity} left
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
