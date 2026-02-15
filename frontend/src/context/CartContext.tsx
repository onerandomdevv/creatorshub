/**
 * CartContext.tsx
 *
 * Provides a global shopping cart state using React Context.
 * Handles adding/removing items, updating quantities, clearing the cart,
 * and persisting data to LocalStorage for a seamless user experience.
 */
"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { Product } from "@/types/product";
import { toast, Toaster } from "react-hot-toast";

/**
 * Represents an item currently in the shopping cart.
 * Extends the base Product type with a 'quantity' property.
 */
export interface CartItem extends Product {
  quantity: number;
}

/**
 * Defines the state and functions provided by the CartContext.
 */
interface CartContextType {
  cartItems: CartItem[]; // Array of products currently in the cart
  addToCart: (product: Product) => void; // Adds a product or increments its count
  updateQuantity: (id: string, quantity: number) => void; // Changes a specific item's count
  removeFromCart: (id: string) => void; // Completely removes an item
  clearCart: () => void; // Wipes all items from the cart
  cartCount: number; // Total number of individual items in the cart
}

const CartContext = createContext<CartContextType | undefined>(undefined);

/**
 * CartProvider Component
 *
 * This component wraps the application (or specific parts of it) to provide cart state
 * to all child components. It handles:
 * 1. Managing the list of cart items.
 * 2. Persisting data to LocalStorage so items remain after refresh.
 * 3. exposing helper functions (add, remove, update) via the context.
 */
export function CartProvider({ children }: { children: ReactNode }) {
  // Initialize state from localStorage if available (client-side only check)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      const storedCart = localStorage.getItem("creatorshub-cart");
      return storedCart ? JSON.parse(storedCart) : [];
    }
    return [];
  });

  // Sync state changes to localStorage whenever 'cartItems' is updated.
  // This ensures the cart is saved even if the user closes the browser.
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("creatorshub-cart", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  /**
   * Adds a product to the cart.
   * If the product already exists, it increments the quantity.
   */
  const addToCart = (product: Product) => {
    const productId = product._id || product.id;

    setCartItems((prevItems) => {
      // Check if product is already in cart using either _id or id
      const existingItem = prevItems.find(
        (item) => (item._id || item.id) === productId,
      );

      if (existingItem) {
        return prevItems.map((item) =>
          (item._id || item.id) === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...prevItems, { ...product, id: productId, quantity: 1 }];
    });
    toast.success("Item added to cart");
  };

  const removeFromCart = (id: string) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => (item._id || item.id) !== id),
    );
  };

  /**
   * Updates the quantity of a specific item.
   * If quantity is 0 or less, the item is removed.
   */
  const updateQuantity = (id: string, quantity: number) => {
    setCartItems((prevItems) => {
      if (quantity <= 0) {
        return prevItems.filter((item) => (item._id || item.id) !== id);
      }

      return prevItems.map((item) =>
        (item._id || item.id) === id ? { ...item, quantity } : item,
      );
    });
  };

  /**
   * Clears all items from the cart.
   */
  const clearCart = () => {
    setCartItems([]);
  };

  // Derived state: Total count of all items in the cart
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
      }}
    >
      {children}
      <Toaster position="bottom-right" />
    </CartContext.Provider>
  );
}

/**
 * Custom hook for easy access to the CartContext.
 * Throws an error if used outside of a CartProvider.
 */
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
