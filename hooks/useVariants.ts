import * as React from 'react';
import { useSocket } from './useSocket';

interface Variant {
  id: number;
  jersey_id: number;
  size: string;
  sleeve: string | null;
  sku: string;
  stock_quantity: number;
  low_stock_threshold: number;
  created_at: string;
  updated_at: string;
}

interface StockUpdatePayload {
  sku: string;
  newQuantity: number;
  jersey_id: number;
}

interface VariantCreatedPayload {
  jersey_id: number;
  variant: Variant;
}

interface VariantDeletedPayload {
  jersey_id: number;
  variantId: number;
}

export function useVariants(jerseyId: number) {
  const [variants, setVariants] = React.useState<Variant[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const { socket } = useSocket();

  const fetchVariants = React.useCallback(async () => {
    if (!jerseyId) return;
    
    try {
      setIsLoading(true);
      const response = await fetch(`/api/jerseys/${jerseyId}/variants`);
      if (!response.ok) throw new Error('Failed to fetch variants');
      const data = await response.json();
      setVariants(data);
    } catch (error) {
      console.error('Error fetching variants:', error);
    } finally {
      setIsLoading(false);
    }
  }, [jerseyId]);

  React.useEffect(() => {
    fetchVariants();
  }, [fetchVariants]);

  React.useEffect(() => {
    if (!socket) return;

    const handleStockUpdate = (data: StockUpdatePayload) => {
      if (data.jersey_id !== jerseyId) return;
      setVariants(prev => 
        prev.map(v => 
          v.sku === data.sku ? { ...v, stock_quantity: data.newQuantity } : v
        )
      );
    };

    const handleVariantCreated = (data: VariantCreatedPayload) => {
      if (data.jersey_id !== jerseyId) return;
      setVariants(prev => {
        if (prev.some(v => v.id === data.variant.id)) return prev;
        return [...prev, data.variant];
      });
    };

    const handleVariantDeleted = (data: VariantDeletedPayload) => {
      if (data.jersey_id !== jerseyId) return;
      setVariants(prev => prev.filter(v => v.id !== data.variantId));
    };

    socket.on('stock:updated', handleStockUpdate);
    socket.on('variant:created', handleVariantCreated);
    socket.on('variant:deleted', handleVariantDeleted);

    return () => {
      socket.off('stock:updated', handleStockUpdate);
      socket.off('variant:created', handleVariantCreated);
      socket.off('variant:deleted', handleVariantDeleted);
    };
  }, [socket, jerseyId]);

  const addVariant = React.useCallback(async (variantData: Omit<Variant, 'id' | 'created_at' | 'updated_at'>) => {
    // The server will emit an event, so we don't need to manually update state here.
    // The socket listener will handle it.
    const response = await fetch('/api/variants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(variantData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to add variant');
    }
    return await response.json();
  }, []);

  const deleteVariant = React.useCallback(async (id: number) => {
    const response = await fetch(`/api/variants/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to delete variant' }));
      throw new Error(errorData.error);
    }
    // State will be updated via socket event
  }, []);

  return { variants, isLoading, addVariant, deleteVariant, refetch: fetchVariants };
}
