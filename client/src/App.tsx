import * as React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Dashboard } from '@/pages/Dashboard';
import { Inventory } from '@/pages/Inventory';
import { Sales } from '@/pages/Sales';
import { Reports } from '@/pages/Reports';
import { Teams } from '@/pages/Teams';
import { Customers } from '@/pages/Customers';
import { JerseyDetail } from '@/pages/JerseyDetail';
import { SocketProvider } from '@/hooks/useSocket.tsx';
import { Toaster } from '@/components/ui/toaster';
import { CouponsPage } from '@/pages/CouponsPage';

function App() {
  return (
    <SocketProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <Navigation />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/teams" element={<Teams />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/jerseys/:id" element={<JerseyDetail />} />
              <Route path="/sales" element={<Sales />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/coupons" element={<CouponsPage />} />
            </Routes>
          </main>
          <Toaster />
        </div>
      </Router>
    </SocketProvider>
  );
}

export default App;
