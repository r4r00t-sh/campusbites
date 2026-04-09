import React, { createContext, useContext, useState, useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { MenuItem, CartItem, Order, OrderStatus, CrowdLevel } from '@/types';
import { initialMenu } from '@/data/mockData';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

interface AppState {
  menu: MenuItem[];
  cart: CartItem[];
  orders: Order[];
  nextToken: number;
}

interface PersistedGlobal {
  menu: MenuItem[];
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
const CARTS_KEY = 'campusbites_carts';

function loadGlobal(): PersistedGlobal {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as Record<string, unknown>;
      return {
        menu: Array.isArray(parsed.menu) ? (parsed.menu as MenuItem[]) : initialMenu,
        orders: Array.isArray(parsed.orders) ? (parsed.orders as Order[]) : [],
        nextToken: typeof parsed.nextToken === 'number' ? parsed.nextToken : 1001,
      };
    }
  } catch {}
  return { menu: initialMenu, orders: [], nextToken: 1001 };
}

function saveGlobal(state: PersistedGlobal) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadAllCarts(): Record<string, CartItem[]> {
  try {
    const raw = localStorage.getItem(CARTS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (typeof parsed !== 'object' || parsed === null) return {};
    const out: Record<string, CartItem[]> = {};
    for (const [k, v] of Object.entries(parsed)) {
      if (Array.isArray(v)) out[k] = v as CartItem[];
    }
    return out;
  } catch {
    return {};
  }
}

function loadCartForUser(admissionNo: string): CartItem[] {
  const carts = loadAllCarts();
  return carts[admissionNo] ?? [];
}

function saveCartForUser(admissionNo: string, cart: CartItem[]) {
  const carts = loadAllCarts();
  carts[admissionNo] = cart;
  localStorage.setItem(CARTS_KEY, JSON.stringify(carts));
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const admissionNo = user?.admissionNo ?? null;

  const [menu, setMenu] = useState<MenuItem[]>(() => loadGlobal().menu);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(() => loadGlobal().orders);
  const [nextToken, setNextToken] = useState(() => loadGlobal().nextToken);

  const admissionRef = useRef(admissionNo);
  const cartSnapshotRef = useRef<CartItem[]>([]);
  admissionRef.current = admissionNo;
  cartSnapshotRef.current = cart;

  const prevAdmissionRef = useRef<string | null>(null);

  useLayoutEffect(() => {
    const prev = prevAdmissionRef.current;
    if (prev && prev !== admissionNo) {
      saveCartForUser(prev, cartSnapshotRef.current);
    }
    prevAdmissionRef.current = admissionNo;
    if (admissionNo) {
      setCart(loadCartForUser(admissionNo));
    } else {
      setCart([]);
    }
  }, [admissionNo]);

  useEffect(() => {
    saveGlobal({ menu, orders, nextToken });
  }, [menu, orders, nextToken]);

  const addToCart = useCallback((item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(c => c.item.id === item.id);
      const next = existing
        ? prev.map(c => (c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c))
        : [...prev, { item, quantity: 1 }];
      const key = admissionRef.current;
      if (key) saveCartForUser(key, next);
      return next;
    });
    toast.success(`${item.name} added to cart`);
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setCart(prev => {
      const next = prev.filter(c => c.item.id !== itemId);
      const key = admissionRef.current;
      if (key) saveCartForUser(key, next);
      return next;
    });
  }, []);

  const updateCartQuantity = useCallback((itemId: string, quantity: number) => {
    setCart(prev => {
      const next =
        quantity <= 0 ? prev.filter(c => c.item.id !== itemId) : prev.map(c => (c.item.id === itemId ? { ...c, quantity } : c));
      const key = admissionRef.current;
      if (key) saveCartForUser(key, next);
      return next;
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    const key = admissionRef.current;
    if (key) saveCartForUser(key, []);
  }, []);

  const cartTotal = cart.reduce((sum, c) => sum + c.item.price * c.quantity, 0);
  const cartCount = cart.reduce((sum, c) => sum + c.quantity, 0);

  const placeOrder = useCallback(
    (studentName: string): Order => {
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
      const key = admissionRef.current;
      if (key) saveCartForUser(key, []);

      return order;
    },
    [cart, nextToken, cartTotal]
  );

  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => (o.id === orderId ? { ...o, status } : o)));
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
    setMenu(prev => prev.map(m => (m.id === item.id ? item : m)));
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
    orders.forEach(o =>
      o.items.forEach(i => {
        counts[i.item.id] = (counts[i.item.id] || 0) + i.quantity;
      })
    );
    return menu
      .filter(m => counts[m.id])
      .sort((a, b) => (counts[b.id] || 0) - (counts[a.id] || 0))
      .slice(0, 5);
  }, [orders, menu]);

  return (
    <AppContext.Provider
      value={{
        menu,
        cart,
        orders,
        nextToken,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        placeOrder,
        updateOrderStatus,
        cancelOrder,
        updateMenuItem,
        addMenuItem,
        getStudentOrders,
        getCrowdLevel,
        getPopularItems,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
