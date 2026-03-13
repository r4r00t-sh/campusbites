import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import StudentLayout from '@/components/StudentLayout';

export default function CartPage() {
  const { cart, updateCartQuantity, removeFromCart, clearCart, placeOrder, cartTotal } = useApp();
  const [studentName, setStudentName] = useState('');
  const navigate = useNavigate();

  const handlePlaceOrder = () => {
    if (!studentName.trim()) return;
    const order = placeOrder(studentName.trim());
    navigate(`/student/orders?highlight=${order.id}`);
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
          <label className="text-sm font-medium text-foreground">Your Name</label>
          <Input
            placeholder="Enter your name"
            value={studentName}
            onChange={e => setStudentName(e.target.value)}
            className="rounded-xl"
          />
          <Button
            onClick={handlePlaceOrder}
            disabled={!studentName.trim()}
            className="w-full rounded-xl bg-mint text-mint-foreground hover:bg-mint/80 font-bold text-lg py-6"
          >
            Pay ₹{cartTotal} & Place Order
          </Button>
          <p className="text-xs text-center text-muted-foreground">Payment will be recorded as Paid</p>
        </div>
      </div>
    </StudentLayout>
  );
}
