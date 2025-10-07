import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Copy, Download } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Coupon {
  id: number;
  code: string;
}

export function CouponManagement() {
  const [file, setFile] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState<string[]>([]);
  const [isUploading, setIsUploading] = React.useState(false);
  const [coupons, setCoupons] = React.useState<Coupon[]>([]);
  const [isLoadingCoupons, setIsLoadingCoupons] = React.useState(true);
  const { toast } = useToast();

  const fetchCoupons = React.useCallback(async () => {
    setIsLoadingCoupons(true);
    try {
      const response = await fetch(`/api/coupons`);
      if (!response.ok) throw new Error('Failed to fetch coupons');
      const data = await response.json();
      setCoupons(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingCoupons(false);
    }
  }, []);

  React.useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      handlePreview(selectedFile);
    } else {
      setFile(null);
      setPreview([]);
    }
  };

  const handlePreview = async (selectedFile: File) => {
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('/api/coupons/preview', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setPreview(data.coupons);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Preview Failed',
        description: error instanceof Error ? error.message : 'Could not preview file.',
      });
      setPreview([]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/coupons/import', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      
      toast({
        title: 'Upload Successful',
        description: data.message,
      });
      setFile(null);
      setPreview([]);
      fetchCoupons(); // Refresh the coupon list
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: error instanceof Error ? error.message : 'Could not upload coupons.',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleCopy = async (coupon: Coupon) => {
    try {
      const response = await fetch(`/api/coupons/${coupon.id}/copy`, { method: 'POST' });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to copy coupon');
      }

      await navigator.clipboard.writeText(result.code);
      toast({
        title: 'Success',
        description: 'Coupon copied & removed from list.',
      });
      setCoupons(prev => prev.filter(c => c.id !== coupon.id));
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Could not copy coupon.',
      });
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch(`/api/coupons/export`);
      if (!response.ok) throw new Error('Failed to export coupons');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `used-coupons.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast({
        title: 'Success',
        description: 'Used coupons exported.',
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not export coupons.',
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
      <Card>
        <CardHeader>
          <CardTitle>Upload Coupon List</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="coupon-file">Select .xlsx file</Label>
            <Input id="coupon-file" type="file" accept=".xlsx" onChange={handleFileChange} />
          </div>

          {preview.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold">Coupon Preview (First 10)</h3>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Coupon Code (from Column A)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {preview.map((coupon, index) => (
                      <TableRow key={index}>
                        <TableCell>{coupon}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <Button onClick={handleUpload} disabled={isUploading}>
                <Upload className="h-4 w-4 mr-2" />
                {isUploading ? 'Uploading...' : 'Confirm and Upload'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Available Coupons</CardTitle>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export Used
          </Button>
        </CardHeader>
        <CardContent>
          {isLoadingCoupons ? (
            <p>Loading coupons...</p>
          ) : coupons.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No available coupons.</p>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
              {coupons.map(coupon => (
                <div
                  key={coupon.id}
                  className="flex items-center justify-between p-3 border rounded-md bg-muted/50 select-none"
                >
                  <span className="font-mono text-sm">{coupon.code}</span>
                  <Button size="icon" variant="ghost" onClick={() => handleCopy(coupon)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
