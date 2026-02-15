"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Define routes where Navbar and Footer should be hidden
  // We hide them on Dashboard (has its own sidebar) and Auth pages (standalone layouts)
  const isDashboard = pathname?.startsWith("/dashboard");
  const isAuthPage =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname?.startsWith("/verify-email");

  const shouldHideLayout =
    isDashboard ||
    isAuthPage ||
    pathname === "/order-success" ||
    pathname?.startsWith("/order-success");

  return (
    <>
      {!shouldHideLayout && <Navbar />}
      {children}
      {!shouldHideLayout && <Footer />}
    </>
  );
}
