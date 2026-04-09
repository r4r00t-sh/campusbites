import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { Check, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import StudentLayout from '@/components/StudentLayout';

export default function CartPage() {
  const { user } = useAuth();
  const { cart, updateCartQuantity, removeFromCart, clearCart, placeOrder, cartTotal } = useApp();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!showSuccessPopup || !placedOrderId) return;

    if (countdown <= 0) {
      navigate(`/student/orders?highlight=${placedOrderId}`);
      return;
    }

    const timer = window.setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [countdown, showSuccessPopup, placedOrderId, navigate]);

  const goToOrdersNow = () => {
    if (!placedOrderId) return;
    navigate(`/student/orders?highlight=${placedOrderId}`);
  };

  const successPopup = showSuccessPopup ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl">
        <div className="rounded-t-3xl bg-green-50 px-6 py-7 text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-500 shadow-lg ring-4 ring-green-100">
            <Check size={48} className="text-white" strokeWidth={3.5} />
          </div>
        </div>

        <div className="px-6 pb-6 pt-4 text-center">
          <h3 className="text-3xl font-display font-bold text-foreground">Payment Successful</h3>
          <p className="mt-3 text-muted-foreground">
            Your order has been placed. Redirecting to your orders page in{' '}
            <span className="font-bold text-green-600">{countdown}s</span>.
          </p>
          <Button onClick={goToOrdersNow} className="mt-6 w-full rounded-xl bg-green-500 text-white hover:bg-green-600">
            Go to Orders Now
          </Button>
        </div>
      </div>
    </div>
  ) : null;

  const handlePlaceOrder = () => {
    const name = user?.name?.trim() ?? '';
    if (!name || isProcessingPayment) return;
    setIsProcessingPayment(true);
    const order = placeOrder(name);
    setPlacedOrderId(order.id);
    setCountdown(10);
    setShowSuccessPopup(true);
    setIsProcessingPayment(false);
  };

  if (cart.length === 0) {
    return (
      <StudentLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-center px-4">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
            <ShoppingBag size={32} className="text-muted-foreground" />
          </div>
          <h2 className="font-display font-bold text-xl text-foreground">Your cart is empty</h2>
          <p className="text-muted-foreground">Browse the menu and add items to get started!</p>
          <Button onClick={() => navigate('/student/menu')} className="rounded-xl bg-primary text-primary-foreground">
            Browse Menu
          </Button>
        </div>
        {successPopup}
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="p-4 space-y-4 max-w-lg mx-auto">
        <h2 className="font-display font-bold text-xl text-foreground">Your Cart</h2>

        <div className="space-y-3">
          {cart.map(({ item, quantity }) => (
            <div key={item.id} className="glass rounded-2xl p-4 flex items-center gap-3">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{item.name}</h3>
                <p className="text-sm text-muted-foreground">₹{item.price} each</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateCartQuantity(item.id, quantity - 1)}
                  className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-foreground hover:bg-border transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="w-6 text-center font-bold text-foreground">{quantity}</span>
                <button
                  onClick={() => updateCartQuantity(item.id, quantity + 1)}
                  className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-foreground hover:bg-primary/30 transition-colors"
                >
                  <Plus size={14} />
                </button>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-destructive hover:bg-destructive/10 transition-colors ml-1"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <span className="font-bold text-foreground min-w-[50px] text-right">₹{item.price * quantity}</span>
            </div>
          ))}
        </div>

        <button onClick={clearCart} className="text-sm text-destructive hover:underline">
          Clear Cart
        </button>

        <Separator />

        <div className="flex justify-between items-center">
          <span className="font-display font-bold text-lg text-foreground">Total</span>
          <span className="font-display font-bold text-2xl text-foreground">₹{cartTotal}</span>
        </div>

        <Separator />

        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Order will be placed for <span className="font-medium text-foreground">{user?.name}</span>
          </p>
          <Button
            onClick={handlePlaceOrder}
            disabled={!user?.name?.trim() || isProcessingPayment || showSuccessPopup}
            className="w-full rounded-xl bg-mint text-mint-foreground hover:bg-mint/80 font-bold text-lg py-6"
          >
            {isProcessingPayment ? 'Processing Payment...' : `Pay ₹${cartTotal} & Place Order`}
          </Button>
          <p className="text-xs text-center text-muted-foreground">Payment will be recorded as Paid</p>
        </div>
      </div>

      {successPopup}
    </StudentLayout>
  );
}
