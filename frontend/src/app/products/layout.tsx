import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gear Catalog | Creators Hub",
  description:
    "Browse our ultra-premium selection of professional gear for content creators.",
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
