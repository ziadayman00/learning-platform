// app/actions/progress.ts
"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

// Mark lesson as complete
export async function markLessonComplete(lessonId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    const userId = session.user.id;

    // Get lesson to find course slug for revalidation
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        section: {
          include: {
            course: {
              select: { slug: true },
            },
          },
        },
      },
    });

    // Update or create progress
    await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
      update: {
        isCompleted: true,
        updatedAt: new Date(),
      },
      create: {
        userId,
        lessonId,
        isCompleted: true,
      },
    });

    // Revalidate certificate page if lesson exists
    if (lesson?.section?.course?.slug) {
      revalidatePath(`/courses/${lesson.section.course.slug}/certificate`);
      revalidatePath(`/courses/${lesson.section.course.slug}/learn`);
    }

    return { success: true };
  } catch (error) {
    console.error("Error marking lesson complete:", error);
    return { error: "Failed to mark lesson as complete" };
  }
}

// Update video playback position
export async function updateLessonProgress(lessonId: string, position: number) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    const userId = session.user.id;

    // Update or create progress with position
    await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
      update: {
        lastPosition: Math.floor(position),
        updatedAt: new Date(),
      },
      create: {
        userId,
        lessonId,
        lastPosition: Math.floor(position),
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating lesson progress:", error);
    return { error: "Failed to update progress" };
  }
}

// Get course progress
export async function getCourseProgress(courseId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    const userId = session.user.id;

    // Get all lessons in the course
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        sections: {
          include: {
            lessons: {
              select: { id: true },
            },
          },
        },
      },
    });

    if (!course) {
      return { error: "Course not found" };
    }

    const totalLessons = course.sections.reduce(
      (sum: number, section: any) => sum + section.lessons.length,
      0
    );
    
    // Get completed lessons
    const completedLessons = await prisma.lessonProgress.count({
      where: {
        userId,
        lesson: {
          section: {
            courseId,
          },
        },
        isCompleted: true,
      },
    });

    const progress =
      totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

    return {
      success: true,
      totalLessons,
      completedLessons,
      progress: Math.round(progress),
    };
  } catch (error) {
    console.error("Error getting course progress:", error);
    return { error: "Failed to get progress" };
  }
}
