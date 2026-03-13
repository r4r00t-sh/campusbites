import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, LogOut } from 'lucide-react';

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();

  const nav = [
    { to: '/staff/dashboard', icon: LayoutDashboard, label: 'Orders' },
    { to: '/staff/menu', icon: BookOpen, label: 'Menu' },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="glass sticky top-0 z-50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">👨‍🍳</span>
          <h1 className="text-xl font-bold font-display text-foreground">CampusBites Staff</h1>
        </div>
        <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
          <LogOut size={20} />
        </Link>
      </header>

      <div className="flex flex-1">
        {/* Side nav on desktop, bottom on mobile */}
        <aside className="hidden md:flex flex-col w-48 glass border-r p-4 gap-1 sticky top-14 h-[calc(100vh-56px)]">
          {nav.map(({ to, icon: Icon, label }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all font-medium ${
                  active ? 'bg-primary/20 text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </aside>

        <main className="flex-1 pb-20 md:pb-4 animate-fade-in">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass z-50 flex justify-around py-2 px-2">
        {nav.map(({ to, icon: Icon, label }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-all ${
                active ? 'bg-primary/20 text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon size={20} />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
