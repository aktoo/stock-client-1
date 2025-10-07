import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, Download } from 'lucide-react';

interface ProfitabilityData {
  total_inventory_cost: number;
  total_inventory_retail: number;
  potential_gross_profit: number;
  profit_margin: number;
}

export function ProfitabilityReport() {
  const [data, setData] = React.useState<ProfitabilityData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/reports/profitability');
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error('Error fetching profitability report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportData = () => {
    if (!data) return;
    
    const csv = [
      'Metric,Value',
      `Total Inventory Cost,${data.total_inventory_cost.toFixed(2)}`,
      `Total Inventory Retail,${data.total_inventory_retail.toFixed(2)}`,
      `Potential Gross Profit,${data.potential_gross_profit.toFixed(2)}`,
      `Profit Margin,${data.profit_margin.toFixed(2)}%`,
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'profitability-report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="animate-pulse">
          <div className="h-6 bg-muted rounded" />
        </CardHeader>
        <CardContent className="animate-pulse">
          <div className="space-y-4">
            <div className="h-16 bg-muted rounded" />
            <div className="h-16 bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center space-x-2">
          <DollarSign className="h-5 w-5" />
          <span>Profitability Overview</span>
        </CardTitle>
        <Button size="sm" variant="outline" onClick={exportData}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </CardHeader>
      <CardContent>
        {data ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Inventory Cost</p>
                <p className="text-2xl font-bold">${data.total_inventory_cost.toFixed(2)}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Inventory Retail Value</p>
                <p className="text-2xl font-bold">${data.total_inventory_retail.toFixed(2)}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Potential Profit</p>
                <p className="text-2xl font-bold text-green-600">
                  ${data.potential_gross_profit.toFixed(2)}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Profit Margin</p>
                <p className="text-2xl font-bold text-green-600">
                  {data.profit_margin.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground">No data available</p>
        )}
      </CardContent>
    </Card>
  );
}
