// app/actions/enrollment.ts
"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function directEnroll(courseId: string, courseSlug: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { error: "You must be signed in to enroll" };
    }

    // Check if already enrolled
    const existingPurchase = await prisma.purchase.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId: courseId,
        },
      },
    });

    if (existingPurchase) {
      return { error: "You are already enrolled in this course" };
    }

    // Get course details
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { price: true },
    });

    if (!course) {
      return { error: "Course not found" };
    }

    // Create purchase record with COMPLETED status
    await prisma.purchase.create({
      data: {
        userId: session.user.id,
        courseId: courseId,
        amount: course.price,
        paymentStatus: "COMPLETED",
        paymentId: `free-enrollment-${Date.now()}`, // Placeholder payment ID
      },
    });

    // Revalidate paths
    revalidatePath(`/courses/${courseSlug}`);
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/purchases");

    return { success: true, courseSlug };
  } catch (error) {
    console.error("Direct enrollment error:", error);
    return { error: "Failed to enroll. Please try again." };
  }
}
