import { useApp } from '@/context/AppContext';
import { Badge } from '@/components/ui/badge';
import StudentLayout from '@/components/StudentLayout';

export default function HistoryPage() {
  const { orders } = useApp();
  const completedOrders = orders
    .filter(o => o.status === 'completed')
    .sort((a, b) => new Date(b.orderTime).getTime() - new Date(a.orderTime).getTime());

  // Show all orders for history (both active and completed)
  const allOrders = [...orders].sort((a, b) => new Date(b.orderTime).getTime() - new Date(a.orderTime).getTime());

  if (allOrders.length === 0) {
    return (
      <StudentLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-center px-4">
          <div className="text-5xl">📜</div>
          <h2 className="font-display font-bold text-xl text-foreground">No order history</h2>
          <p className="text-muted-foreground">Your past orders will appear here</p>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="p-4 space-y-4 max-w-lg mx-auto">
        <h2 className="font-display font-bold text-xl text-foreground">Order History</h2>

        {allOrders.map(order => (
          <div key={order.id} className="glass rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-display font-bold text-lg text-foreground">#{order.token}</span>
                <Badge variant="secondary" className="text-xs capitalize">{order.status}</Badge>
              </div>
              <Badge className={order.paymentStatus === 'paid' ? 'bg-success/20 text-success-foreground' : 'bg-warning/20 text-warning-foreground'}>
                {order.paymentStatus}
              </Badge>
            </div>

            <div className="text-xs text-muted-foreground">
              {new Date(order.orderTime).toLocaleDateString()} at{' '}
              {new Date(order.orderTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>

            <div className="space-y-1">
              {order.items.map(({ item, quantity }) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-foreground">{item.name} × {quantity}</span>
                  <span className="text-muted-foreground">₹{item.price * quantity}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-2 border-t border-border">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="font-bold text-foreground">₹{order.totalAmount}</span>
            </div>
          </div>
        ))}
      </div>
    </StudentLayout>
  );
}
