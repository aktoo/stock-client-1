import * as React from 'react';
import { useSocket } from './useSocket';

interface Sale {
  id: number;
  sku: string;
  quantity: number;
  sale_price: number;
  discount_amount: number;
  original_price: number;
  timestamp: string;
  customer_name: string | null;
  notes: string | null;
}

export function useSales() {
  const [sales, setSales] = React.useState<Sale[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const { socket } = useSocket();

  const fetchSales = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/sales');
      if (!response.ok) throw new Error('Failed to fetch sales');
      const data = await response.json();
      setSales(data);
    } catch (error) {
      console.error('Error fetching sales:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  React.useEffect(() => {
    if (!socket) return;

    const handleNewSale = (newSale: Sale) => {
      setSales(prevSales => {
        // Avoid duplicates
        if (prevSales.some(s => s.id === newSale.id)) {
          return prevSales;
        }
        return [newSale, ...prevSales];
      });
    };

    const handleSaleDeleted = ({ saleId }: { saleId: number }) => {
      setSales(prev => prev.filter(s => s.id !== saleId));
    };

    socket.on('sale:created', handleNewSale);
    socket.on('sale:deleted', handleSaleDeleted);

    return () => {
      socket.off('sale:created', handleNewSale);
      socket.off('sale:deleted', handleSaleDeleted);
    };
  }, [socket]);

  const deleteSale = React.useCallback(async (saleId: number) => {
    const response = await fetch(`/api/sales/${saleId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to delete sale' }));
      throw new Error(errorData.error);
    }
    // State will be updated via socket event
  }, []);

  return { sales, isLoading, refetch: fetchSales, deleteSale };
}
