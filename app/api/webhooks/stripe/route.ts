import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/db";
import { users, creditTransactions } from "@/db/schema";
import { eq } from "drizzle-orm";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Handle checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const userId = session.metadata?.userId;
    const creditAmount = session.metadata?.creditAmount;

    if (!userId || !creditAmount) {
      console.error("Missing metadata in checkout session:", session.id);
      return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
    }

    const creditsToAdd = parseInt(creditAmount, 10);
    if (isNaN(creditsToAdd) || creditsToAdd <= 0) {
      console.error("Invalid credit amount:", creditAmount);
      return NextResponse.json(
        { error: "Invalid credit amount" },
        { status: 400 }
      );
    }

    try {
      // Get current user credits
      const userList = await db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (userList.length === 0) {
        console.error("User not found:", userId);
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const currentCredits = userList[0].credits;

      // Update user credits and create transaction record
      await db.transaction(async (tx) => {
        // Update credits
        await tx
          .update(users)
          .set({ credits: currentCredits + creditsToAdd })
          .where(eq(users.id, userId));

        // Record transaction
        await tx.insert(creditTransactions).values({
          userId: userId,
          amount: creditsToAdd,
          type: "charge",
        });
      });

      console.log(
        `Credits added: ${creditsToAdd} to user ${userId} (session: ${session.id})`
      );

      return NextResponse.json({ received: true });
    } catch (error) {
      console.error("Error processing webhook:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}
