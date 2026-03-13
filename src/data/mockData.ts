import { MenuItem } from '@/types';

export const initialMenu: MenuItem[] = [
  { id: '1', name: 'Samosa', category: 'snacks', price: 15, available: true, prepTime: 5 },
  { id: '2', name: 'Vada Pav', category: 'snacks', price: 20, available: true, prepTime: 5 },
  { id: '3', name: 'French Fries', category: 'snacks', price: 40, available: true, prepTime: 8 },
  { id: '4', name: 'Sandwich', category: 'snacks', price: 35, available: true, prepTime: 7 },
  { id: '5', name: 'Spring Roll', category: 'snacks', price: 30, available: false, prepTime: 10 },
  { id: '6', name: 'Thali Meal', category: 'meals', price: 80, available: true, prepTime: 15 },
  { id: '7', name: 'Biryani', category: 'meals', price: 90, available: true, prepTime: 12 },
  { id: '8', name: 'Fried Rice', category: 'meals', price: 60, available: true, prepTime: 10 },
  { id: '9', name: 'Pasta', category: 'meals', price: 70, available: true, prepTime: 12 },
  { id: '10', name: 'Paneer Wrap', category: 'meals', price: 55, available: false, prepTime: 8 },
  { id: '11', name: 'Masala Chai', category: 'beverages', price: 15, available: true, prepTime: 3 },
  { id: '12', name: 'Cold Coffee', category: 'beverages', price: 40, available: true, prepTime: 5 },
  { id: '13', name: 'Fresh Lime Soda', category: 'beverages', price: 25, available: true, prepTime: 3 },
  { id: '14', name: 'Mango Lassi', category: 'beverages', price: 35, available: true, prepTime: 4 },
  { id: '15', name: 'Buttermilk', category: 'beverages', price: 20, available: true, prepTime: 2 },
];
