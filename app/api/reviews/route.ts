import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId, rating, comment } = await req.json();

    if (!courseId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    // Check if user purchased the course
    const purchase = await prisma.purchase.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId,
        },
        paymentStatus: "COMPLETED",
      },
    });

    if (!purchase) {
      return NextResponse.json(
        { error: "You must purchase the course to review it" },
        { status: 403 }
      );
    }

    // Upsert review (create or update)
    const review = await prisma.review.upsert({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId,
        },
      },
      update: {
        rating,
        comment,
      },
      create: {
        userId: session.user.id,
        courseId,
        rating,
        comment,
      },
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error("[REVIEW_ERROR]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}