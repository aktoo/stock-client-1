import * as React from 'react';

interface DashboardStats {
  totalProducts: number;
  inventoryValue: number;
  todaySales: number;
  lowStockCount: number;
}

export function useDashboardStats() {
  const [stats, setStats] = React.useState<DashboardStats>({
    totalProducts: 0,
    inventoryValue: 0,
    todaySales: 0,
    lowStockCount: 0,
  });
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchStats() {
      try {
        const [jerseysRes, salesRes, alertsRes, profitabilityRes] = await Promise.all([
          fetch('/api/jerseys'),
          fetch('/api/sales'),
          fetch('/api/alerts/low-stock'),
          fetch('/api/reports/profitability'),
        ]);

        if (!jerseysRes.ok || !salesRes.ok || !alertsRes.ok || !profitabilityRes.ok) {
          throw new Error('Failed to fetch all dashboard data');
        }

        const jerseys = await jerseysRes.json();
        const sales = await salesRes.json();
        const alerts = await alertsRes.json();
        const profitability = await profitabilityRes.json();

        const today = new Date().toISOString().split('T')[0];
        const todaySales = sales
          .filter((sale: any) => sale.timestamp.startsWith(today))
          .reduce((sum: number, sale: any) => sum + (sale.sale_price * sale.quantity), 0);

        setStats({
          totalProducts: jerseys.length,
          inventoryValue: profitability.total_inventory_retail || 0,
          todaySales,
          lowStockCount: alerts.length,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  return { stats, isLoading };
}
