import * as React from 'react';
import { CouponManagement } from '@/components/coupons/CouponManagement';

export function CouponsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Free Delivery Code Management</h1>
      <CouponManagement />
    </div>
  );
}
