import { create } from 'zustand';
import type { IProduct } from '../types/product';

export interface ICartItem extends IProduct {
  quantity: number;
}

interface CartState {
  items: ICartItem[];
  addToCart: (product: IProduct) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  getTotalAmount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  
  addToCart: (product) => set((state) => {
    const existingItem = state.items.find(item => item.id === product.id);
    if (existingItem) {
      return {
        items: state.items.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      };
    }
    return { items: [...state.items, { ...product, quantity: 1 }] };
  }),

  removeFromCart: (productId) => set((state) => ({
    items: state.items.filter(item => item.id !== productId)
  })),

  clearCart: () => set({ items: [] }),

  // Подсчет общей суммы
  getTotalAmount: () => {
    return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
}));