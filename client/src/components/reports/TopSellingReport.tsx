import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TrendingUp, Download } from 'lucide-react';

interface TopSellingItem {
  sku: string;
  size: string;
  jersey_name: string;
  season: string;
  team_name: string;
  total_sold: number;
  total_revenue: number;
}

export function TopSellingReport() {
  const [data, setData] = React.useState<TopSellingItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [period, setPeriod] = React.useState('7');

  React.useEffect(() => {
    fetchData();
  }, [period]);

  const fetchData = async () => {
    try {
      const response = await fetch(`/api/reports/top-selling?period=${period}`);
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error('Error fetching top selling report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportData = () => {
    if (data.length === 0) return;
    
    const csv = [
      'SKU,Team,Jersey,Season,Size,Units Sold,Revenue',
      ...data.map(item => 
        `${item.sku},${item.team_name},${item.jersey_name},${item.season},${item.size},${item.total_sold},${item.total_revenue}`
      )
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `top-selling-${period}days.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5" />
          <span>Top Selling Items</span>
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" variant="outline" onClick={exportData}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-muted rounded animate-pulse" />
            ))}
          </div>
        ) : data.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No sales data for the selected period.
          </p>
        ) : (
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {data.map((item, index) => (
              <div key={item.sku} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {item.team_name} {item.jersey_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.season} • Size {item.size} • {item.sku}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{item.total_sold} sold</p>
                  <p className="text-sm text-muted-foreground">
                    ${parseFloat(item.total_revenue.toString()).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
