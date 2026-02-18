"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface PricingProps {
  onOpenVoice: () => void;
}

const plans = [
  {
    name: "Growth Engine",
    plan: "growth",
    price: "497",
    originalPrice: "1,797",
    description: "For solo operators",
    features: [
      "500 leads/month",
      "300 voice AI minutes",
      "Lead scoring engine",
      "Automated booking",
      "Email support",
    ],
    popular: false,
  },
  {
    name: "Lead Recovery",
    plan: "lead_recovery",
    price: "997",
    originalPrice: "2,497",
    description: "For teams up to 10",
    features: [
      "2,000 leads/month",
      "1,500 voice AI minutes",
      "Lead scoring engine",
      "Priority support",
      "Custom integrations",
      "Dedicated account manager",
    ],
    popular: true,
  },
];

export default function Pricing({ onOpenVoice }: PricingProps) {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  async function handleCheckout(plan: string) {
    setLoadingPlan(plan);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.ok && data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Checkout failed. Please try again.");
        setLoadingPlan(null);
      }
    } catch {
      alert("Connection error. Please try again.");
      setLoadingPlan(null);
    }
  }

  return (
    <section id="pricing" className="px-6 py-28 lg:px-8 lg:py-36">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="mb-4 text-center"
        >
          <span className="inline-block rounded-full bg-[--color-accent]/10 px-4 py-1.5 text-sm font-semibold text-[--color-accent]">
            Early Adopter Pricing — Locked In Forever
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
          className="mb-4 text-center text-3xl font-bold tracking-tight text-[--color-text-primary] sm:text-4xl lg:text-[48px]"
        >
          Founder&apos;s rate
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
          className="mb-16 text-center text-base text-[--color-text-secondary]"
        >
          Join now and keep this price as long as you&apos;re a customer. No
          tricks.
        </motion.p>

        <div className="grid gap-6 sm:grid-cols-2 sm:gap-8">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: i * 0.15,
                ease: [0.23, 1, 0.32, 1],
              }}
              className={`glass relative p-8 sm:p-10 ${
                plan.popular
                  ? "ring-2 ring-[--color-accent] ring-offset-2 ring-offset-white"
                  : ""
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[--color-accent] px-4 py-1 text-xs font-semibold text-white">
                  Popular
                </span>
              )}

              <p className="mb-1 text-sm font-medium text-[--color-text-secondary]">
                {plan.description}
              </p>
              <h3 className="mb-6 text-xl font-bold text-[--color-text-primary] sm:text-2xl">
                {plan.name}
              </h3>

              <div className="mb-8">
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-lg text-[--color-text-tertiary] line-through">
                    ${plan.originalPrice}/mo
                  </span>
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                    Save{" "}
                    {Math.round(
                      (1 -
                        parseInt(plan.price.replace(",", "")) /
                          parseInt(plan.originalPrice.replace(",", ""))) *
                        100
                    )}
                    %
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold tracking-tight text-[--color-text-primary] sm:text-[56px]">
                    ${plan.price}
                  </span>
                  <span className="text-base text-[--color-text-tertiary]">
                    /mo
                  </span>
                </div>
              </div>

              <ul className="mb-10 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 text-base text-[--color-text-secondary]"
                  >
                    <svg
                      className="h-4 w-4 shrink-0 text-[--color-accent]"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="space-y-3">
                <button
                  onClick={() => handleCheckout(plan.plan)}
                  disabled={loadingPlan !== null}
                  className={`w-full rounded-full py-3.5 text-base font-semibold transition-all disabled:opacity-50 ${
                    plan.popular
                      ? "bg-[--color-accent] text-white shadow-lg shadow-[--color-accent-glow] hover:bg-[--color-accent-hover]"
                      : "bg-[--color-text-primary] text-white hover:bg-gray-800"
                  }`}
                >
                  {loadingPlan === plan.plan
                    ? "Redirecting to checkout..."
                    : "Subscribe Now"}
                </button>
                <button
                  onClick={onOpenVoice}
                  className="w-full rounded-full border border-gray-200 bg-white py-3 text-sm font-medium text-[--color-text-secondary] transition-all hover:border-gray-300 hover:bg-gray-50"
                >
                  Talk to AI advisor first
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
