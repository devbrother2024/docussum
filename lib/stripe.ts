import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-11-17.clover",
  typescript: true,
});

// Credit package price IDs (from Stripe Dashboard or MCP)
export const CREDIT_PACKAGES = {
  "30": "price_1SYjFyRWFC8GcvUVHIoYaZb7", // $5 for 30 credits
  "50": "price_1SYjFyRWFC8GcvUVaxAopQsC", // $8 for 50 credits
  "100": "price_1SYjFyRWFC8GcvUVcCSNEhCN", // $15 for 100 credits
} as const;

export type CreditPackage = keyof typeof CREDIT_PACKAGES;
