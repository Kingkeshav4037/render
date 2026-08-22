import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string; // Internal uuid for cart tracking
  item_type: 'ACCOMMODATION' | 'ACTIVITY' | 'TRANSPORT' | 'RESTAURANT' | 'PACKAGE' | 'EVENT' | 'PRODUCT' | 'DEAL';
  item_id: string;
  name: string;
  description?: string;
  unit_price: number;
  quantity: number;
  image?: string;
  start_time?: string;
  end_time?: string;
  pax?: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  setIsOpen: (isOpen: boolean) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      addItem: (item) => {
        set((state) => {
          // If it's a physical product, we can just increment quantity
          if (item.item_type === 'PRODUCT') {
            const existingItem = state.items.find((i) => i.item_id === item.item_id && i.item_type === 'PRODUCT');
            if (existingItem) {
              return {
                items: state.items.map((i) =>
                  i.id === existingItem.id
                    ? { ...i, quantity: i.quantity + item.quantity }
                    : i
                ),
                isOpen: true
              };
            }
          }
          
          return { items: [...state.items, { ...item, id: crypto.randomUUID() }], isOpen: true };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      updateQuantity: (id, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return { items: state.items.filter((item) => item.id !== id) };
          }
          return {
            items: state.items.map((item) =>
              item.id === id ? { ...item, quantity } : item
            ),
          };
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getCartTotal: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.unit_price * item.quantity, 0);
      },
      
      setIsOpen: (isOpen) => set({ isOpen })
    }),
    {
      name: 'smartlife-cart-storage',
    }
  )
);

// We export this alias so components currently using `useCart` from CartProvider will seamlessly switch over
// once we change their imports
export const useCart = () => {
  return useCartStore();
};
