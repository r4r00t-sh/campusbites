import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { MenuItem, CartItem, Order, OrderStatus, CrowdLevel } from '@/types';
import { initialMenu } from '@/data/mockData';
import { toast } from 'sonner';

interface AppState {
  menu: MenuItem[];
  cart: CartItem[];
  orders: Order[];
  nextToken: number;
}

interface AppContextType extends AppState {
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  placeOrder: (studentName: string) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  cancelOrder: (orderId: string) => boolean;
  updateMenuItem: (item: MenuItem) => void;
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  getStudentOrders: (studentName: string) => Order[];
  getCrowdLevel: () => CrowdLevel;
  getPopularItems: () => MenuItem[];
  cartTotal: number;
  cartCount: number;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEY = 'campusbites_state';

function loadState(): AppState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...parsed, cart: parsed.cart || [] };
    }
  } catch {}
  return { menu: initialMenu, cart: [], orders: [], nextToken: 1001 };
}

function saveState(state: AppState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [menu, setMenu] = useState<MenuItem[]>(() => loadState().menu);
  const [cart, setCart] = useState<CartItem[]>(() => loadState().cart);
  const [orders, setOrders] = useState<Order[]>(() => loadState().orders);
  const [nextToken, setNextToken] = useState(() => loadState().nextToken);

  useEffect(() => {
    saveState({ menu, cart, orders, nextToken });
  }, [menu, cart, orders, nextToken]);

  const addToCart = useCallback((item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(c => c.item.id === item.id);
      if (existing) {
        return prev.map(c => c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prev, { item, quantity: 1 }];
    });
    toast.success(`${item.name} added to cart`);
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setCart(prev => prev.filter(c => c.item.id !== itemId));
  }, []);

  const updateCartQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(prev => prev.filter(c => c.item.id !== itemId));
    } else {
      setCart(prev => prev.map(c => c.item.id === itemId ? { ...c, quantity } : c));
    }
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const cartTotal = cart.reduce((sum, c) => sum + c.item.price * c.quantity, 0);
  const cartCount = cart.reduce((sum, c) => sum + c.quantity, 0);

  const placeOrder = useCallback((studentName: string): Order => {
    const maxPrepTime = Math.max(...cart.map(c => c.item.prepTime));
    const now = new Date();
    const readyTime = new Date(now.getTime() + maxPrepTime * 60000);

    const order: Order = {
      id: `ORD-${Date.now()}`,
      studentName,
      token: nextToken,
      items: [...cart],
      orderTime: now.toISOString(),
      expectedReadyTime: readyTime.toISOString(),
      paymentStatus: 'paid',
      status: 'received',
      totalAmount: cartTotal,
    };

    setOrders(prev => [...prev, order]);
    setNextToken(prev => prev + 1);
    setCart([]);
    return order;
  }, [cart, nextToken, cartTotal]);

  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    toast.info(`Order status updated to ${status}`);
  }, []);

  const cancelOrder = useCallback((orderId: string): boolean => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return false;
    const elapsed = Date.now() - new Date(order.orderTime).getTime();
    if (elapsed > 120000) {
      toast.error('Cannot cancel — 2 minute window has passed');
      return false;
    }
    setOrders(prev => prev.filter(o => o.id !== orderId));
    toast.success('Order cancelled');
    return true;
  }, [orders]);

  const updateMenuItem = useCallback((item: MenuItem) => {
    setMenu(prev => prev.map(m => m.id === item.id ? item : m));
  }, []);

  const addMenuItem = useCallback((item: Omit<MenuItem, 'id'>) => {
    setMenu(prev => [...prev, { ...item, id: `item-${Date.now()}` }]);
  }, []);

  const getStudentOrders = useCallback((studentName: string) => {
    return orders.filter(o => o.studentName === studentName);
  }, [orders]);

  const getCrowdLevel = useCallback((): CrowdLevel => {
    const active = orders.filter(o => o.status !== 'completed').length;
    if (active <= 3) return 'low';
    if (active <= 8) return 'medium';
    return 'high';
  }, [orders]);

  const getPopularItems = useCallback((): MenuItem[] => {
    const counts: Record<string, number> = {};
    orders.forEach(o => o.items.forEach(i => {
      counts[i.item.id] = (counts[i.item.id] || 0) + i.quantity;
    }));
    return menu
      .filter(m => counts[m.id])
      .sort((a, b) => (counts[b.id] || 0) - (counts[a.id] || 0))
      .slice(0, 5);
  }, [orders, menu]);

  return (
    <AppContext.Provider value={{
      menu, cart, orders, nextToken,
      addToCart, removeFromCart, updateCartQuantity, clearCart,
      placeOrder, updateOrderStatus, cancelOrder,
      updateMenuItem, addMenuItem,
      getStudentOrders, getCrowdLevel, getPopularItems,
      cartTotal, cartCount,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
