import prisma from '@/lib/prisma';
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";

export const POST = async (req: Request) => {
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return new NextResponse("No signature", { status: 400 });
  }

  const buf = await req.arrayBuffer();
  const rawBody = Buffer.from(buf);

  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
  } catch (err: any) {
    console.error("⚠️ Webhook signature verification failed.", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle the event
  try {
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session;

        // Extract metadata
        const courseId = session.metadata?.courseId;
        const userId = session.metadata?.userId;

        if (!courseId || !userId) {
          console.error("❌ Missing metadata in session:", session.id);
          return new NextResponse("Missing metadata", { status: 400 });
        }

        // Check if purchase already exists (to avoid duplicates)
        const existingPurchase = await prisma.purchase.findUnique({
          where: {
            userId_courseId: {
              userId,
              courseId,
            },
          },
        });

        if (existingPurchase) {
          console.log(`ℹ️ Purchase already exists for user ${userId} and course ${courseId}`);
          
          // Update the existing purchase if needed
          await prisma.purchase.update({
            where: { id: existingPurchase.id },
            data: {
              paymentStatus: "COMPLETED",
              stripeSessionId: session.id,
              paymentId: session.payment_intent as string,
              amount: (session.amount_total ?? 0) / 100,
            },
          });
        } else {
          // Create new purchase record
          await prisma.purchase.create({
            data: {
              courseId,
              userId,
              stripeSessionId: session.id,
              paymentId: session.payment_intent as string,
              amount: (session.amount_total ?? 0) / 100, // Convert from cents to dollars
              paymentStatus: "COMPLETED",
            },
          });
        }

        console.log(`💰 Payment received for session ${session.id}`);
        console.log(`✅ User ${userId} enrolled in course ${courseId}`);
        break;

      case "checkout.session.expired":
        const expiredSession = event.data.object as Stripe.Checkout.Session;
        console.log(`⏱️ Checkout session expired: ${expiredSession.id}`);
        break;

      case "payment_intent.payment_failed":
        const failedIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`❌ Payment failed: ${failedIntent.id}`);
        
        // Optionally update purchase status to FAILED if it exists
        if (failedIntent.metadata?.userId && failedIntent.metadata?.courseId) {
          await prisma.purchase.updateMany({
            where: {
              userId: failedIntent.metadata.userId,
              courseId: failedIntent.metadata.courseId,
              paymentId: failedIntent.id,
            },
            data: {
              paymentStatus: "FAILED",
            },
          });
        }
        break;

      case "charge.refunded":
        const refund = event.data.object as Stripe.Charge;
        console.log(`💸 Refund processed: ${refund.id}`);
        
        // Update purchase status to REFUNDED
        await prisma.purchase.updateMany({
          where: {
            paymentId: refund.payment_intent as string,
          },
          data: {
            paymentStatus: "REFUNDED",
          },
        });
        break;

      case "payment_intent.succeeded":
      case "payment_intent.created":
      case "charge.succeeded":
      case "charge.failed":
      case "charge.updated":
        // Log but don't process (these are informational)
        console.log(`ℹ️ Event ${event.type} received`);
        break;

      default:
        console.log(`⚠️ Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("❌ Webhook handler error:", error);
    return new NextResponse(`Webhook handler error: ${error.message}`, { 
      status: 500 
    });
  }
};