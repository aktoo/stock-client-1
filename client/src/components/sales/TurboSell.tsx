import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, CheckCircle, XCircle, ScanLine } from 'lucide-react';

interface TurboSellProps {
  onSaleProcessed: () => void;
}

interface SaleFeedback {
  type: 'success' | 'error';
  message: string;
  sku: string;
}

export function TurboSell({ onSaleProcessed }: TurboSellProps) {
  const [sku, setSku] = React.useState('');
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [feedback, setFeedback] = React.useState<SaleFeedback | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    // Auto-focus the input when the component mounts or after processing
    if (!isProcessing) {
      inputRef.current?.focus();
    }
  }, [isProcessing]);

  React.useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sku.trim() || isProcessing) return;

    setIsProcessing(true);
    try {
      const response = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sku: sku.trim(), quantity: 1 }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process sale');
      }

      const saleData = await response.json();
      setFeedback({ type: 'success', message: `Sold 1 unit.`, sku: saleData.sku });
      onSaleProcessed();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setFeedback({ type: 'error', message: errorMessage, sku: sku.trim() });
    } finally {
      setSku('');
      setIsProcessing(false);
    }
  };

  return (
    <Card className="bg-primary/10 border-primary">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-primary">
          <Zap className="h-6 w-6" />
          <span>Turbo Sell Mode Active</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleScan}>
          <div className="relative">
            <ScanLine className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              ref={inputRef}
              type="text"
              placeholder="Ready to scan..."
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              disabled={isProcessing}
              className="pl-10 text-lg h-12"
              autoFocus
            />
          </div>
        </form>
        
        <div className="h-12">
          {feedback && (
            <div 
              className={`flex items-center space-x-3 p-3 rounded-md ${
                feedback.type === 'success' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <div>
                <p className={`text-sm font-medium ${
                  feedback.type === 'success' ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'
                }`}>
                  {feedback.message}
                </p>
                <p className="text-xs text-muted-foreground">{feedback.sku}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
