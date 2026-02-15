import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Cart | Creators Hub",
  description:
    "Review your selected professional gear and prepare for checkout.",
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
