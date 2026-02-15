// No longer importing static products data
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/product/AddToCartButton";
import { ArrowLeft, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import Link from "next/link";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Image from "next/image";
import ProductPrice from "@/components/product/ProductPrice";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function generateMetadata({ params }: ProductPageProps) {
  const { id } = await params;
  try {
    const res = await fetch(`${API_URL}/products/${id}`);
    const data = await res.json();
    if (data.success) {
      const product = data.data;
      return {
        title: `${product.name} | Creators Hub`,
        description: product.description,
        openGraph: {
          title: `${product.name} | Creators Hub`,
          description: product.description,
          images: [{ url: product.image }],
        },
      };
    }
  } catch (error) {
    console.error("Metadata error:", error);
  }

  return {
    title: "Product Not Found | Creators Hub",
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  let product = null;
  try {
    const res = await fetch(`${API_URL}/products/${id}`, { cache: "no-store" });
    const data = await res.json();
    if (data.success) {
      product = data.data;
    }
  } catch (err) {
    console.error("Error fetching product:", err);
  }

  if (!product) {
    notFound();
  }

  const imageSrc =
    product.image?.startsWith("http") || product.image?.startsWith("/")
      ? product.image
      : `/${product.image}`;

  return (
    <main className="min-h-screen pt-24 md:pt-32 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <AnimatedSection direction="right" className="mb-12">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-zinc-700 hover:text-black transition-colors font-bold uppercase tracking-widest text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Catalog
          </Link>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <AnimatedSection direction="right" className="relative group">
            <div className="aspect-[4/5] bg-gray-50 rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-2xl relative">
              <Image
                src={imageSrc}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute top-6 left-6">
                <span className="px-4 py-2 bg-black text-white text-xs font-black uppercase tracking-widest rounded-full">
                  {product.category}
                </span>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection direction="left" delay={0.2} className="space-y-10">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-black text-black dark:text-white tracking-tighter leading-tight">
                {product.name}
              </h1>
              <ProductPrice basePrice={product.price} />
            </div>

            <div className="space-y-6 text-lg text-zinc-600 leading-relaxed border-t border-gray-100 pt-8">
              <p>{product.description}</p>
              <p>
                Developed specifically for content creators who demand
                professional-grade results. This gear combines durability with
                intuitive design to help you focus on your craft.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex flex-col gap-4">
                <AddToCartButton product={product} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-gray-100">
                <div className="flex items-start gap-3">
                  <Truck className="w-5 h-5 text-teal-600 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-black">
                      Fast Shipping
                    </h4>
                    <p className="text-xs text-zinc-500">2-4 business days</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-black">
                      Full Warranty
                    </h4>
                    <p className="text-xs text-zinc-500">2 years protection</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <RotateCcw className="w-5 h-5 text-teal-600 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-black">
                      Easy Returns
                    </h4>
                    <p className="text-xs text-zinc-500">30-day window</p>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </main>
  );
}
