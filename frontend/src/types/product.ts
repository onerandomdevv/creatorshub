/**
 * product.ts
 * 
 * Centralized type definitions for products.
 */
/**
 * Represents a single product in the store.
 * 
 * This interface defines the shape of our product data throughout the application.
 * By defining it here, we ensure type safety across components and pages.
 */
export interface Product {
  id: string;
  _id?: string;       // MongoDB ID
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  brand: string;      
  niche: string[];    // Matches backend "niche"
  niches?: string[];  // For backward compatibility
  isFeatured?: boolean; 
  countInStock?: number;
}
