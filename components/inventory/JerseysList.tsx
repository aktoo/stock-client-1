import * as React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Package, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useJerseys } from '@/hooks/useJerseys';

export function JerseysList() {
  const { jerseys, isLoading, deleteJersey } = useJerseys();
  const navigate = useNavigate();

  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to delete the jersey "${name}"? This action cannot be undone.`)) {
      try {
        await deleteJersey(id);
      } catch (error) {
        alert('Failed to delete jersey.');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-12 bg-muted rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (jerseys.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No jerseys found. Add your first jersey to get started.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Image</TableHead>
          <TableHead>Team & Jersey</TableHead>
          <TableHead>Season</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Supplier</TableHead>
          <TableHead>Cost Price</TableHead>
          <TableHead>Retail Price</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {jerseys.map((jersey) => (
          <TableRow key={jersey.id}>
            <TableCell>
              {jersey.image_path ? (
                <img 
                  src={`/images/${jersey.image_path}`} 
                  alt={jersey.name}
                  className="w-12 h-12 object-cover rounded"
                />
              ) : (
                <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                  <Package className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
            </TableCell>
            <TableCell>
              <div>
                <div className="font-medium">{jersey.team_name}</div>
                <div className="text-sm text-muted-foreground">{jersey.name}</div>
              </div>
            </TableCell>
            <TableCell>{jersey.season}</TableCell>
            <TableCell>
              <Badge variant="secondary">{jersey.type}</Badge>
            </TableCell>
            <TableCell>{jersey.supplier || '-'}</TableCell>
            <TableCell>${(jersey.cost_price || 0).toFixed(2)}</TableCell>
            <TableCell>${(jersey.retail_price || 0).toFixed(2)}</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(`/jerseys/${jersey.id}`)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(jersey.id, `${jersey.team_name} ${jersey.name}`)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
