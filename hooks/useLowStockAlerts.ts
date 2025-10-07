import * as React from 'react';

interface LowStockAlert {
  sku: string;
  size: string;
  stock_quantity: number;
  low_stock_threshold: number;
  jersey_name: string;
  team_name: string;
}

export function useLowStockAlerts() {
  const [alerts, setAlerts] = React.useState<LowStockAlert[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchAlerts() {
      try {
        const response = await fetch('/api/alerts/low-stock');
        if (!response.ok) throw new Error('Failed to fetch alerts');
        const data = await response.json();
        setAlerts(data);
      } catch (error) {
        console.error('Error fetching low stock alerts:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAlerts();
  }, []);

  return { alerts, isLoading };
}
