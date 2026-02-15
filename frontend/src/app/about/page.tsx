import Link from "next/link";
import { ArrowRight, Target, Users, Zap, Globe } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Story | Creators Hub",
  description:
    "Learn about the mission and team behind the ultra-premium foundry for professional content creators.",
};

export default function AboutPage() {
  return (
    <main className="bg-black min-h-screen text-white pt-32 pb-20">
      {/* Hero Section */}
      <section className="relative px-8 mb-32">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-tight">
            EMPOWERING THE <br />
            <span className="text-teal-500">NEXT GENERATION</span> <br />
            OF CREATORS.
          </h1>
          <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl leading-relaxed">
            We provide the tools, gear, and community you need to turn your
            creative vision into reality. No compromises. Just pure performance.
          </p>
        </div>
        {/* Decorative Grid */}
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-20 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-zinc-800 bg-zinc-900/50 backdrop-blur-sm mb-32">
        <div className="max-w-7xl mx-auto px-8 py-16 grid grid-cols-2 md:grid-cols-4 gap-12">
          {[
            { label: "Active Creators", value: "50K+" },
            { label: "Products Shipped", value: "120K+" },
            { label: "Countries Served", value: "35" },
            { label: "Creator Support", value: "24/7" },
          ].map((stat, index) => (
            <div key={index} className="space-y-2">
              <div className="text-4xl md:text-5xl font-black text-white">
                {stat.value}
              </div>
              <div className="text-sm font-bold uppercase tracking-widest text-zinc-500">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission Content */}
      <section className="max-w-7xl mx-auto px-8 mb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-3xl font-black uppercase tracking-tight flex items-center gap-3">
              <Target className="w-8 h-8 text-teal-500" />
              Our Mission
            </h2>
            <div className="space-y-6 text-zinc-400 text-lg leading-relaxed">
              <p>
                Creators Hub wasn't born in a boardroom. It started in a
                makeshift studio, fueled by coffee and a frustration with subpar
                gear. We realized that creators deserve better than generic
                electronics.
              </p>
              <p>
                Our mission is simple:{" "}
                <strong>To democratize professional-grade production.</strong>{" "}
                We scour the globe for the best cameras, lights, and audio
                interfaces, curating a catalog that cuts through the noise.
              </p>
              <p>
                Whether you're streaming your first game or shooting a
                documentary, we've got your back with gear that performs as hard
                as you do.
              </p>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-bold uppercase tracking-wide hover:bg-teal-400 transition-colors"
            >
              Check our Gear <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="relative aspect-square md:aspect-video lg:aspect-square bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 flex items-center justify-center group">
            {/* Placeholder for About Image - could use generate_image if needed, using CSS pattern for now */}
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-black"></div>
            <div className="relative z-10 text-center space-y-4">
              <div className="w-24 h-24 bg-teal-500/10 rounded-full flex items-center justify-center mx-auto border border-teal-500/20 group-hover:scale-110 transition-transform duration-500">
                <Globe className="w-10 h-10 text-teal-500" />
              </div>
              <h3 className="text-2xl font-bold text-white">Global Reach</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="max-w-7xl mx-auto px-8 pb-32">
        <h2 className="text-3xl font-black uppercase tracking-tight mb-16 text-center">
          Why Chooses Us
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Zap,
              title: "Built for Speed",
              desc: "We prioritize gear that sets up fast and works instantly. Less fiddling, more creating.",
            },
            {
              icon: Users,
              title: "Community First",
              desc: "We are not just a store. We are a collective of creators sharing tips, setups, and inspiration.",
            },
            {
              icon: Target,
              title: "Curated Quality",
              desc: "We don't sell everything. We only sell what we would use ourselves. Quality over quantity, always.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl hover:border-teal-500/50 transition-colors group"
            >
              <item.icon className="w-10 h-10 text-zinc-500 mb-6 group-hover:text-teal-500 transition-colors" />
              <h3 className="text-xl font-bold text-white mb-4">
                {item.title}
              </h3>
              <p className="text-zinc-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
