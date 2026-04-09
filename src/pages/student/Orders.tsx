import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { OrderStatus } from '@/types';
import { Clock, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import StudentLayout from '@/components/StudentLayout';

const statusConfig: Record<OrderStatus, { label: string; className: string; step: number }> = {
  received: { label: 'Order Received', className: 'status-received', step: 1 },
  preparing: { label: 'Preparing', className: 'status-preparing', step: 2 },
  ready: { label: 'Ready for Pickup', className: 'status-ready', step: 3 },
  completed: { label: 'Completed', className: 'status-completed', step: 4 },
};

const steps: OrderStatus[] = ['received', 'preparing', 'ready', 'completed'];

export default function OrdersPage() {
  const { user } = useAuth();
  const { getStudentOrders, cancelOrder } = useApp();
  const activeOrders = getStudentOrders(user?.name ?? '')
    .filter(o => o.status !== 'completed')
    .sort((a, b) => b.token - a.token);

  const canCancel = (orderTime: string) => Date.now() - new Date(orderTime).getTime() < 120000;

  if (activeOrders.length === 0) {
    return (
      <StudentLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-center px-4">
          <div className="text-5xl">📋</div>
          <h2 className="font-display font-bold text-xl text-foreground">No active orders</h2>
          <p className="text-muted-foreground">Place an order from the menu to see it here!</p>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="p-4 space-y-4 max-w-lg mx-auto">
        <h2 className="font-display font-bold text-xl text-foreground">Active Orders</h2>

        {activeOrders.map(order => {
          const config = statusConfig[order.status];
          const currentStep = config.step;

          return (
            <div key={order.id} className="glass rounded-2xl p-5 space-y-4 animate-slide-up">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-muted-foreground">Token</span>
                  <h3 className="font-display font-bold text-3xl text-foreground">#{order.token}</h3>
                </div>
                <Badge className={config.className}>{config.label}</Badge>
              </div>

              {/* Progress tracker */}
              <div className="flex items-center gap-1">
                {steps.map((step, i) => (
                  <div key={step} className="flex-1 flex items-center">
                    <div className={`h-2 w-full rounded-full transition-all ${
                      i < currentStep ? 'bg-primary' : 'bg-muted'
                    }`} />
                  </div>
                ))}
              </div>

              {/* Items */}
              <div className="space-y-1">
                {order.items.map(({ item, quantity }) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-foreground">{item.name} × {quantity}</span>
                    <span className="text-muted-foreground">₹{item.price * quantity}</span>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Clock size={14} />
                  <span>Est. ready: {new Date(order.expectedReadyTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <span className="font-bold text-foreground">₹{order.totalAmount}</span>
              </div>

              {canCancel(order.orderTime) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => cancelOrder(order.id)}
                  className="w-full rounded-xl text-destructive border-destructive/30 hover:bg-destructive/10"
                >
                  <X size={14} className="mr-1" />
                  Cancel Order
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </StudentLayout>
  );
}
