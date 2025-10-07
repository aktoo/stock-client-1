import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Package, Plus } from 'lucide-react';
import { VariantsList } from '@/components/jersey/VariantsList';
import { AddVariantDialog } from '@/components/jersey/AddVariantDialog';
import { useJerseyDetail } from '@/hooks/useJerseyDetail';

export function JerseyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showAddVariant, setShowAddVariant] = React.useState(false);
  const { jersey, isLoading } = useJerseyDetail(id || '');

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="h-8 w-48 bg-muted rounded animate-pulse" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="animate-pulse">
              <div className="h-6 bg-muted rounded" />
            </CardHeader>
            <CardContent className="animate-pulse">
              <div className="space-y-4">
                <div className="h-48 bg-muted rounded" />
                <div className="h-4 bg-muted rounded" />
                <div className="h-4 bg-muted rounded w-3/4" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="animate-pulse">
              <div className="h-6 bg-muted rounded" />
            </CardHeader>
            <CardContent className="animate-pulse">
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-12 bg-muted rounded" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!jersey) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        <Card>
          <CardContent className="text-center py-8">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Jersey Not Found</h2>
            <p className="text-muted-foreground">The requested jersey could not be found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{jersey.team_name} {jersey.name}</h1>
            <p className="text-muted-foreground">{jersey.season} • {jersey.type}</p>
          </div>
        </div>
        <Button onClick={() => setShowAddVariant(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Size Variant
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-4">
              {jersey.image_path ? (
                <img 
                  src={`/images/${jersey.image_path}`} 
                  alt={jersey.name}
                  className="w-32 h-32 object-cover rounded-lg border"
                />
              ) : (
                <div className="w-32 h-32 bg-muted rounded-lg flex items-center justify-center">
                  <Package className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
              
              <div className="flex-1 space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Team</p>
                  <p className="text-lg font-semibold">{jersey.team_name}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Season</p>
                    <p>{jersey.season}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Type</p>
                    <Badge variant="secondary">{jersey.type}</Badge>
                  </div>
                </div>
                
                {jersey.supplier && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Supplier</p>
                    <p>{jersey.supplier}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Cost Price</p>
                    <p className="text-lg font-semibold">${jersey.cost_price.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Retail Price</p>
                    <p className="text-lg font-semibold">${jersey.retail_price.toFixed(2)}</p>
                  </div>
                </div>
                
                {jersey.description && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Description</p>
                    <p className="text-sm">{jersey.description}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Size Variants & Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <VariantsList jerseyId={parseInt(id || '0')} />
          </CardContent>
        </Card>
      </div>

      <AddVariantDialog 
        open={showAddVariant} 
        onOpenChange={setShowAddVariant}
        jerseyId={parseInt(id || '0')}
        jersey={{
          team_name: jersey.team_name,
          season: jersey.season,
          type: jersey.type,
        }}
      />
    </div>
  );
}
