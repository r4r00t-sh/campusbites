import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, ClipboardList, History, UtensilsCrossed } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Badge } from '@/components/ui/badge';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const { cartCount, getCrowdLevel } = useApp();
  const crowd = getCrowdLevel();

  const crowdConfig = {
    low: { label: 'Low Crowd', className: 'bg-success/20 text-success-foreground' },
    medium: { label: 'Moderate', className: 'bg-warning/20 text-warning-foreground' },
    high: { label: 'Busy', className: 'bg-destructive/20 text-destructive-foreground' },
  };

  const nav = [
    { to: '/student/menu', icon: UtensilsCrossed, label: 'Menu' },
    { to: '/student/cart', icon: ShoppingCart, label: 'Cart', badge: cartCount },
    { to: '/student/orders', icon: ClipboardList, label: 'Orders' },
    { to: '/student/history', icon: History, label: 'History' },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="glass sticky top-0 z-50 px-4 py-3 flex items-center justify-between">
        <Link to="/student/menu" className="flex items-center gap-2">
          <span className="text-2xl">🍽️</span>
          <h1 className="text-xl font-bold font-display text-foreground">CampusBites</h1>
        </Link>
        <Badge className={crowdConfig[crowd].className}>
          {crowdConfig[crowd].label}
        </Badge>
      </header>

      {/* Content */}
      <main className="flex-1 pb-20 animate-fade-in">
        {children}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 glass z-50 flex justify-around py-2 px-2">
        {nav.map(({ to, icon: Icon, label, badge }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all relative ${
                active ? 'bg-primary/20 text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon size={20} />
              <span className="text-xs font-medium">{label}</span>
              {badge ? (
                <span className="absolute -top-1 -right-1 bg-peach text-peach-foreground text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
