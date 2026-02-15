import ProductCard from "./Productcard";
import { Product } from "@/types/product";
import AnimatedSection from "../ui/AnimatedSection";

/**
 * Product Grid Layout
 *
 * A responsive grid container for displaying collections of products.
 * - Uses CSS Grid for responsiveness (1 column on mobile, 3 on large screens).
 * - Maps over the `products` data array to render individual cards.
 */

export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
      {products.map((product, i) => (
        <AnimatedSection key={product._id || product.id} delay={i * 0.05}>
          <ProductCard
            id={product._id || product.id}
            name={product.name}
            price={product.price}
            image={product.image}
          />
        </AnimatedSection>
      ))}
    </div>
  );
}
