import { useApp } from '@/context/AppContext';
import { OrderStatus } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import StaffLayout from '@/components/StaffLayout';
import { ChefHat, Clock, CheckCircle } from 'lucide-react';

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  received: { label: 'Received', className: 'status-received' },
  preparing: { label: 'Preparing', className: 'status-preparing' },
  ready: { label: 'Ready', className: 'status-ready' },
  completed: { label: 'Done', className: 'status-completed' },
};

const nextStatus: Partial<Record<OrderStatus, OrderStatus>> = {
  received: 'preparing',
  preparing: 'ready',
  ready: 'completed',
};

const nextStatusAction: Partial<Record<OrderStatus, { label: string; icon: React.ReactNode }>> = {
  received: { label: 'Start Preparing', icon: <ChefHat size={16} /> },
  preparing: { label: 'Mark Ready', icon: <Clock size={16} /> },
  ready: { label: 'Complete', icon: <CheckCircle size={16} /> },
};

export default function StaffDashboard() {
  const { orders, updateOrderStatus } = useApp();

  const activeOrders = orders
    .filter(o => o.status !== 'completed')
    .sort((a, b) => a.token - b.token);

  const todayOrders = orders.filter(o => {
    const d = new Date(o.orderTime);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  });

  return (
    <StaffLayout>
      <div className="p-4 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="glass rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold font-display text-foreground">{todayOrders.length}</div>
            <div className="text-xs text-muted-foreground">Today's Orders</div>
          </div>
          <div className="glass rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold font-display text-foreground">{activeOrders.length}</div>
            <div className="text-xs text-muted-foreground">Active</div>
          </div>
          <div className="glass rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold font-display text-foreground">
              {todayOrders.filter(o => o.status === 'completed').length}
            </div>
            <div className="text-xs text-muted-foreground">Completed</div>
          </div>
        </div>

        {/* Active Orders */}
        <div>
          <h2 className="font-display font-bold text-xl text-foreground mb-3">Active Orders</h2>
          {activeOrders.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <div className="text-4xl mb-2">✅</div>
              No pending orders
            </div>
          ) : (
            <div className="space-y-3">
              {activeOrders.map(order => {
                const config = statusConfig[order.status];
                const next = nextStatus[order.status];
                const action = nextStatusAction[order.status];

                return (
                  <div key={order.id} className="glass rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-display font-bold text-2xl text-foreground">#{order.token}</span>
                        <Badge className={config.className}>{config.label}</Badge>
                      </div>
                      <Badge className={order.paymentStatus === 'paid' ? 'bg-success/20 text-success-foreground' : 'bg-warning/20 text-warning-foreground'}>
                        {order.paymentStatus}
                      </Badge>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      {order.studentName} · {new Date(order.orderTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>

                    <div className="space-y-1">
                      {order.items.map(({ item, quantity }) => (
                        <div key={item.id} className="text-sm text-foreground">
                          {item.name} × {quantity}
                        </div>
                      ))}
                    </div>

                    {next && action && (
                      <Button
                        onClick={() => updateOrderStatus(order.id, next)}
                        className="w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/80"
                      >
                        {action.icon}
                        <span className="ml-2">{action.label}</span>
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </StaffLayout>
  );
}
