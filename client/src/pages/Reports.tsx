import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProfitabilityReport } from '@/components/reports/ProfitabilityReport';
import { TopSellingReport } from '@/components/reports/TopSellingReport';

export function Reports() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Business Reports</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <ProfitabilityReport />
        <TopSellingReport />
      </div>
    </div>
  );
}
