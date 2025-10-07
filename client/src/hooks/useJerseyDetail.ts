import * as React from 'react';

interface JerseyDetail {
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

export function useJerseyDetail(id: string) {
  const [jersey, setJersey] = React.useState<JerseyDetail | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    async function fetchJersey() {
      try {
        const response = await fetch(`/api/jerseys/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            setJersey(null);
            return;
          }
          throw new Error('Failed to fetch jersey');
        }
        const data = await response.json();
        setJersey(data);
      } catch (error) {
        console.error('Error fetching jersey:', error);
        setJersey(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchJersey();
  }, [id]);

  return { jersey, isLoading };
}
