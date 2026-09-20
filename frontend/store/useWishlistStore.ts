import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { IProduct } from '../types/index';

interface WishlistState {
  items: (IProduct | any)[];
  toggleWishlist: (product: IProduct | string, token?: string | null) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  fetchServerWishlist: (token: string | null) => Promise<void>;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      toggleWishlist: async (product, token = null) => {
        const currentItems = get().items;
        const productId = typeof product === 'string' ? product : product._id;
        const exists = currentItems.some((i) => (i._id || i) === productId);

        let newItems: any[];
        if (exists) {
          newItems = currentItems.filter((i) => (i._id || i) !== productId);
        } else {
          newItems = [...currentItems, typeof product === 'object' ? product : { _id: productId }];
        }

        set({ items: newItems });

        if (token) {
          try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            await fetch(`${apiUrl}/wishlist/toggle/${productId}`, {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });
          } catch (err) {
            console.error('[Wishlist Store Sync Error]:', err);
          }
        }
      },

      isInWishlist: (productId: string) => {
        return get().items.some((i) => (i._id || i) === productId);
      },

      fetchServerWishlist: async (token: string | null) => {
        if (!token) return;
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
          const res = await fetch(`${apiUrl}/wishlist`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await res.json();
          if (res.ok && data.success && Array.isArray(data.data)) {
            set({ items: data.data });
          }
        } catch (err) {
          console.error('[Wishlist Store Fetch Error]:', err);
        }
      },

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'osmium-wishlist-storage',
    }
  )
);
