export type Category = 'snacks' | 'meals' | 'beverages';

export interface MenuItem {
  id: string;
  name: string;
  category: Category;
  price: number;
  available: boolean;
  prepTime: number; // minutes
  image?: string;
}

export type OrderStatus = 'received' | 'preparing' | 'ready' | 'completed';

export interface CartItem {
  item: MenuItem;
  quantity: number;
}

export interface Order {
  id: string;
  studentName: string;
  token: number;
  items: CartItem[];
  orderTime: string;
  expectedReadyTime: string;
  paymentStatus: 'paid' | 'pending';
  status: OrderStatus;
  totalAmount: number;
}

export type CrowdLevel = 'low' | 'medium' | 'high';
