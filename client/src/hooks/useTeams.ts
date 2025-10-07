import * as React from 'react';

interface Team {
  id: number;
  name: string;
  league: string | null;
  country: string | null;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
}

export function useTeams() {
  const [teams, setTeams] = React.useState<Team[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchTeams = React.useCallback(async () => {
    try {
      const response = await fetch('/api/teams');
      if (!response.ok) throw new Error('Failed to fetch teams');
      const data = await response.json();
      setTeams(data);
    } catch (error) {
      console.error('Error fetching teams:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const addTeam = React.useCallback(async (teamData: Omit<Team, 'id' | 'logo_url' | 'created_at' | 'updated_at'>) => {
    try {
      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(teamData),
      });
      
      if (!response.ok) throw new Error('Failed to add team');
      
      const newTeam = await response.json();
      setTeams(prev => [...prev, newTeam]);
      return newTeam;
    } catch (error) {
      console.error('Error adding team:', error);
      throw error;
    }
  }, []);

  return { teams, isLoading, addTeam, refetch: fetchTeams };
}
