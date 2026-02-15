"use client";

import {
  Search,
  Truck,
  RotateCcw,
  CreditCard,
  User,
  Mail,
  MessageCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Help Categories
const categories = [
  {
    icon: Truck,
    title: "Shipping & Delivery",
    desc: "Track orders, shipping rates, and delivery times.",
  },
  {
    icon: RotateCcw,
    title: "Returns & Refunds",
    desc: "Policy overview, how to return, and refund status.",
  },
  {
    icon: CreditCard,
    title: "Payments",
    desc: "Accepted methods, billing issues, and receipts.",
  },
  {
    icon: User,
    title: "Account & Security",
    desc: "Profile settings, password reset, and privacy.",
  },
];

// FAQs
const faqs = [
  {
    question: "How do I track my order?",
    answer:
      "You can track your order by going to the 'Track an Order' link in the Help menu or checking your Dashboard if you are logged in. You'll need your order ID sent to your email.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We accept returns within 30 days of delivery. Items must be in original condition with all packaging. Return shipping is free for defective items.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "Yes! We ship to over 35 countries. Shipping rates and times vary by location and are calculated at checkout.",
  },
  {
    question: "Can I change my order after placing it?",
    answer:
      "We process orders quickly. You can cancel or modify an order within 1 hour of placing it via your Dashboard. After that, please contact support immediately.",
  },
];

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-black text-white pt-32 pb-20">
      {/* Hero Search Section */}
      <section className="px-8 mb-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter">
            HOW CAN WE <span className="text-teal-500">HELP?</span>
          </h1>
          <div className="relative max-w-2xl mx-auto group">
            <div className="absolute inset-0 bg-teal-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative flex items-center">
              <Search className="absolute left-6 w-6 h-6 text-zinc-500" />
              <input
                type="text"
                placeholder="Search for articles, topics, or keywords..."
                className="w-full bg-zinc-900/80 backdrop-blur-md border border-zinc-800 text-white rounded-full py-5 pl-16 pr-6 text-lg focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all placeholder:text-zinc-500 shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-8 mb-32">
        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-500 mb-8">
          Browse Topics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl hover:border-teal-500/50 hover:bg-zinc-900/80 transition-all group cursor-pointer"
            >
              <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center mb-6 group-hover:bg-teal-500 group-hover:text-black transition-colors">
                <cat.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">{cat.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                {cat.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto px-8 mb-32">
        <h2 className="text-3xl font-black tracking-tight mb-12 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border-b border-zinc-800">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between py-6 text-left group"
              >
                <span
                  className={`text-lg font-bold transition-colors ${openFaq === idx ? "text-teal-500" : "text-white group-hover:text-teal-400"}`}
                >
                  {faq.question}
                </span>
                {openFaq === idx ? (
                  <ChevronUp className="w-5 h-5 text-teal-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-zinc-500" />
                )}
              </button>
              <AnimatePresence>
                {openFaq === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="pb-8 text-zinc-400 leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Footer */}
      <section className="max-w-5xl mx-auto px-8">
        <div className="bg-gradient-to-r from-zinc-900 to-black border border-zinc-800 rounded-3xl p-12 text-center relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl font-black tracking-tight">
              Still need help?
            </h2>
            <p className="text-zinc-400 max-w-lg mx-auto">
              Our support team is available 24/7. We usually respond within 2
              hours.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button className="flex items-center gap-2 bg-white text-black px-8 py-4 rounded-xl font-bold hover:bg-teal-400 transition-colors">
                <MessageCircle className="w-5 h-5" />
                Chat Support
              </button>
              <button className="flex items-center gap-2 bg-black border border-zinc-700 text-white px-8 py-4 rounded-xl font-bold hover:border-teal-500 hover:text-teal-500 transition-colors">
                <Mail className="w-5 h-5" />
                Email Us
              </button>
            </div>
          </div>
          {/* Decor */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2"></div>
        </div>
      </section>
    </main>
  );
}
