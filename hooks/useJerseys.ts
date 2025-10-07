import * as React from 'react';
import { useSocket } from './useSocket';

interface Jersey {
  id: number;
  team_id: number;
  name: string;
  season: string;
  type: string;
  supplier: string | null;
  cost_price: number;
  retail_price: number;
  image_path: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
  team_name: string;
  team_league: string | null;
}

export function useJerseys() {
  const [jerseys, setJerseys] = React.useState<Jersey[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const { socket } = useSocket();

  const fetchJerseys = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/jerseys');
      if (!response.ok) throw new Error('Failed to fetch jerseys');
      const data = await response.json();
      setJerseys(data);
    } catch (error) {
      console.error('Error fetching jerseys:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchJerseys();
  }, [fetchJerseys]);

  React.useEffect(() => {
    if (!socket) return;

    const handleJerseyDeleted = ({ jerseyId }: { jerseyId: number }) => {
      setJerseys(prev => prev.filter(j => j.id !== jerseyId));
    };

    socket.on('jersey:deleted', handleJerseyDeleted);

    return () => {
      socket.off('jersey:deleted', handleJerseyDeleted);
    };
  }, [socket]);

  const addJersey = React.useCallback(async (formData: FormData) => {
    try {
      const response = await fetch('/api/jerseys', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) throw new Error('Failed to add jersey');
      
      // Refetch to get the complete data with team info
      await fetchJerseys();
    } catch (error) {
      console.error('Error adding jersey:', error);
      throw error;
    }
  }, [fetchJerseys]);

  const deleteJersey = React.useCallback(async (id: number) => {
    // The server will emit an event, so we don't need to manually update state here.
    const response = await fetch(`/api/jerseys/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete jersey');
    }
  }, []);

  return { jerseys, isLoading, addJersey, deleteJersey, refetch: fetchJerseys };
}
