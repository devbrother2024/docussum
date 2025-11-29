"use server";

import { stripe, CREDIT_PACKAGES, type CreditPackage } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export async function createCheckoutSession(
  creditAmount: CreditPackage
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const priceId = CREDIT_PACKAGES[creditAmount];
    if (!priceId) {
      return { success: false, error: "Invalid credit package" };
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/dashboard?payment=success`,
      cancel_url: `${baseUrl}/dashboard?payment=cancelled`,
      metadata: {
        userId: user.id,
        creditAmount: creditAmount.toString(),
      },
      customer_email: user.email || undefined,
    });

    if (!session.url) {
      return {
        success: false,
        error: "Failed to create checkout session",
      };
    }

    return { success: true, url: session.url };
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
