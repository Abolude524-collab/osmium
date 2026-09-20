import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { IProduct, CartItem } from '../types/index';

interface CartState {
  items: CartItem[];
  isCartDrawerOpen: boolean;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  addItem: (product: IProduct, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isCartDrawerOpen: false,

      openCartDrawer: () => set({ isCartDrawerOpen: true }),
      closeCartDrawer: () => set({ isCartDrawerOpen: false }),

      addItem: (product, quantity = 1) => {
        const currentItems = get().items;
        const existingItemIndex = currentItems.findIndex(
          (item) => item.product._id === product._id
        );

        let updatedItems: CartItem[];

        if (existingItemIndex > -1) {
          updatedItems = [...currentItems];
          const existingItem = updatedItems[existingItemIndex];
          const newQty = existingItem.quantity + quantity;
          const finalQty = product.stock ? Math.min(newQty, product.stock) : newQty;

          updatedItems[existingItemIndex] = {
            ...existingItem,
            quantity: finalQty,
          };
        } else {
          const finalQty = product.stock ? Math.min(quantity, product.stock) : quantity;
          updatedItems = [
            ...currentItems,
            {
              product: {
                _id: product._id,
                name: product.name,
                slug: product.slug,
                sku: product.sku,
                price: product.price,
                compareAtPrice: product.compareAtPrice,
                currency: product.currency || 'NGN',
                images: product.images,
                stock: product.stock,
                category: product.category,
                rating: product.rating || 0,
                reviewCount: product.reviewCount || 0,
                description: product.description || '',
                featured: product.featured || false,
                status: product.status || 'active',
              },
              quantity: finalQty,
            },
          ];
        }

        set({ items: updatedItems, isCartDrawerOpen: true });
      },

      removeItem: (productId: string) => {
        set({
          items: get().items.filter((item) => item.product._id !== productId),
        });
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set({
          items: get().items.map((item) => {
            if (item.product._id === productId) {
              const maxStock = item.product.stock || 999;
              return {
                ...item,
                quantity: Math.min(quantity, maxStock),
              };
            }
            return item;
          }),
        });
      },

      clearCart: () => set({ items: [] }),

      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },
    }),
    {
      name: 'osmium_cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
