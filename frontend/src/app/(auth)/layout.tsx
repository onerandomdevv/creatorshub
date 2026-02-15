import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-black">
      {/* Left Panel - Visuals (Hidden on mobile) */}
      <div className="hidden lg:relative lg:block bg-zinc-900 overflow-hidden">
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-teal-900/30 to-purple-900/30 mix-blend-overlay" />
        <Image
          src="/pro-camera.png"
          alt="Professional Gear"
          fill
          className="object-cover opacity-80"
          priority
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-between p-16 bg-gradient-to-t from-black/90 via-transparent to-black/30">
          <Link href="/" className="flex items-center gap-3 w-fit group">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-black font-black text-xl group-hover:bg-teal-400 transition-colors shadow-2xl">
              C
            </div>
            <span className="text-xl font-black text-white tracking-tighter">
              CREATORS <span className="text-teal-400">HUB.</span>
            </span>
          </Link>

          <div className="space-y-6 max-w-lg">
            <h1 className="text-6xl font-black text-white leading-[0.9] tracking-tighter">
              ELEVATE <br />
              YOUR <span className="text-teal-500">CRAFT.</span>
            </h1>
            <p className="text-zinc-400 text-lg">
              Join the community of visionaries, streamers, and professionals
              who trust us with their setup.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Form Area */}
      <div className="flex flex-col justify-center items-center p-8 lg:p-16 relative">
        <div className="absolute top-8 left-8 lg:hidden">
          <Link
            href="/"
            className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors font-bold text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Store
          </Link>
        </div>

        <div className="w-full max-w-md space-y-8">{children}</div>
      </div>
    </div>
  );
}
