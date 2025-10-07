import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DollarSign, BarChart3, Home, Users, Search, UserSquare, Menu, X, Package, Ticket } from 'lucide-react';
import { QuickViewPopover } from '@/components/QuickViewPopover';
import { SocketStatusIndicator } from './SocketStatusIndicator';

const navItems = [
  { path: '/', label: 'Dashboard', icon: Home },
  { path: '/inventory', label: 'Inventory', icon: Package, customIcon: '/assets/logo.png' },
  { path: '/teams', label: 'Teams', icon: Users },
  { path: '/customers', label: 'Customers', icon: UserSquare },
  { path: '/sales', label: 'Sales', icon: DollarSign },
  { path: '/reports', label: 'Reports', icon: BarChart3 },
  { path: '/coupons', label: 'Coupon', icon: Ticket },
];

export function Navigation() {
  const location = useLocation();
  const [searchSku, setSearchSku] = React.useState('');
  const [showQuickView, setShowQuickView] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchSku.trim()) {
      setShowQuickView(true);
    }
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <img src="/assets/logo.png" alt="Hypebroo Logo" className="h-10 w-10" />
            <h1 className="text-xl font-bold">Hypebroo</h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map(item => (
              <Button
                key={item.path}
                variant={isActive(item.path) ? 'default' : 'ghost'}
                size="sm"
                asChild
              >
                <Link to={item.path} className="flex items-center space-x-2">
                  {item.customIcon ? (
                    <img src={item.customIcon} alt={item.label} className="h-4 w-4" />
                  ) : (
                    <item.icon className="h-4 w-4" />
                  )}
                  <span>{item.label}</span>
                </Link>
              </Button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <form onSubmit={handleQuickSearch} className="hidden sm:flex items-center space-x-2">
              <Input
                placeholder="Quick search SKU..."
                value={searchSku}
                onChange={(e) => setSearchSku(e.target.value)}
                className="w-32 md:w-48"
              />
              <QuickViewPopover 
                sku={searchSku}
                open={showQuickView}
                onOpenChange={setShowQuickView}
              />
              <Button type="submit" size="sm" variant="outline">
                <Search className="h-4 w-4" />
              </Button>
            </form>
            <SocketStatusIndicator />
            <div className="md:hidden">
              <Button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} size="icon" variant="ghost">
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-background border-b z-50">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map(item => (
              <Button
                key={item.path}
                variant={isActive(item.path) ? 'secondary' : 'ghost'}
                size="sm"
                asChild
                className="w-full justify-start"
                onClick={closeMobileMenu}
              >
                <Link to={item.path} className="flex items-center space-x-2">
                  {item.customIcon ? (
                    <img src={item.customIcon} alt={item.label} className="h-4 w-4" />
                  ) : (
                    <item.icon className="h-4 w-4" />
                  )}
                  <span>{item.label}</span>
                </Link>
              </Button>
            ))}
            <div className="p-2">
              <form onSubmit={handleQuickSearch} className="flex sm:hidden items-center space-x-2">
                <Input
                  placeholder="Quick search SKU..."
                  value={searchSku}
                  onChange={(e) => setSearchSku(e.target.value)}
                  className="w-full"
                />
                <Button type="submit" size="sm" variant="outline">
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
