import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { auth } from "@/lib/auth"; // Import your auth
import { headers } from "next/headers";

export async function POST(req: Request) {
  try {
    // Get authenticated user
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { course } = body;

    if (!course || !course.id || !course.title || !course.price) {
      return new NextResponse("Invalid course data", { status: 400 });
    }

    // Create Stripe checkout session with metadata
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: course.title,
              description: course.description || "",
            },
            unit_amount: course.price * 100, // السعر بالسنت
          },
          quantity: 1,
        },
      ],
      // CRITICAL: Add metadata for webhook
      metadata: {
        courseId: course.id,
        userId: session.user.id,
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.slug}/learn?enrolled=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.slug}`,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("[STRIPE_CHECKOUT_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}