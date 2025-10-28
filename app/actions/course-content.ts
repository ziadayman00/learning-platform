// app/actions/course-content.ts
"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

// ========== SECTION ACTIONS ==========

export async function createSection(courseId: string, formData: FormData) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    const user = session.user;

    // Verify course ownership
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return { error: "Course not found" };
    }

    if (course.instructorId !== user.id && user.role !== "ADMIN") {
      return { error: "You don't have permission to edit this course" };
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    if (!title) {
      return { error: "Title is required" };
    }

    // Get the highest position and add 1
    const lastSection = await prisma.section.findFirst({
      where: { courseId },
      orderBy: { position: "desc" },
    });

    const position = (lastSection?.position || 0) + 1;

    const section = await prisma.section.create({
      data: {
        title,
        description: description || null,
        position,
        courseId,
      },
    });

    revalidatePath(`/instructor/courses/${courseId}/content`);

    return { success: true, section };
  } catch (error) {
    console.error("Error creating section:", error);
    return { error: "Failed to create section" };
  }
}

export async function updateSection(sectionId: string, formData: FormData) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    const user = session.user;

    // Verify section and course ownership
    const section = await prisma.section.findUnique({
      where: { id: sectionId },
      include: { course: true },
    });

    if (!section) {
      return { error: "Section not found" };
    }

    if (section.course.instructorId !== user.id && user.role !== "ADMIN") {
      return { error: "You don't have permission to edit this section" };
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    if (!title) {
      return { error: "Title is required" };
    }

    await prisma.section.update({
      where: { id: sectionId },
      data: {
        title,
        description: description || null,
      },
    });

    revalidatePath(`/instructor/courses/${section.courseId}/content`);

    return { success: true };
  } catch (error) {
    console.error("Error updating section:", error);
    return { error: "Failed to update section" };
  }
}

export async function deleteSection(sectionId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    const user = session.user;

    // Verify section and course ownership
    const section = await prisma.section.findUnique({
      where: { id: sectionId },
      include: { course: true },
    });

    if (!section) {
      return { error: "Section not found" };
    }

    if (section.course.instructorId !== user.id && user.role !== "ADMIN") {
      return { error: "You don't have permission to delete this section" };
    }

    await prisma.section.delete({
      where: { id: sectionId },
    });

    revalidatePath(`/instructor/courses/${section.courseId}/content`);

    return { success: true };
  } catch (error) {
    console.error("Error deleting section:", error);
    return { error: "Failed to delete section" };
  }
}

// ========== LESSON ACTIONS ==========

export async function createLesson(sectionId: string, formData: FormData) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    const user = session.user;

    // Verify section and course ownership
    const section = await prisma.section.findUnique({
      where: { id: sectionId },
      include: { course: true },
    });

    if (!section) {
      return { error: "Section not found" };
    }

    if (section.course.instructorId !== user.id && user.role !== "ADMIN") {
      return { error: "You don't have permission to edit this course" };
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const videoUrl = formData.get("videoUrl") as string;
    const duration = formData.get("duration") as string;
    const isFree = formData.get("isFree") === "true";

    if (!title || !videoUrl) {
      return { error: "Title and video are required" };
    }

    // Get the highest position and add 1
    const lastLesson = await prisma.lesson.findFirst({
      where: { sectionId },
      orderBy: { position: "desc" },
    });

    const position = (lastLesson?.position || 0) + 1;

    const lesson = await prisma.lesson.create({
      data: {
        title,
        description: description || null,
        videoUrl,
        duration: duration ? parseInt(duration) : null,
        isFree,
        position,
        sectionId,
      },
    });

    revalidatePath(`/instructor/courses/${section.courseId}/content`);

    return { success: true, lesson };
  } catch (error) {
    console.error("Error creating lesson:", error);
    return { error: "Failed to create lesson" };
  }
}

export async function updateLesson(lessonId: string, formData: FormData) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    const user = session.user;

    // Verify lesson and course ownership
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        section: {
          include: { course: true },
        },
      },
    });

    if (!lesson) {
      return { error: "Lesson not found" };
    }

    if (
      lesson.section.course.instructorId !== user.id &&
      user.role !== "ADMIN"
    ) {
      return { error: "You don't have permission to edit this lesson" };
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const videoUrl = formData.get("videoUrl") as string;
    const duration = formData.get("duration") as string;
    const isFree = formData.get("isFree") === "true";

    if (!title) {
      return { error: "Title is required" };
    }

    await prisma.lesson.update({
      where: { id: lessonId },
      data: {
        title,
        description: description || null,
        videoUrl: videoUrl || lesson.videoUrl,
        duration: duration ? parseInt(duration) : lesson.duration,
        isFree,
      },
    });

    revalidatePath(`/instructor/courses/${lesson.section.courseId}/content`);

    return { success: true };
  } catch (error) {
    console.error("Error updating lesson:", error);
    return { error: "Failed to update lesson" };
  }
}

export async function deleteLesson(lessonId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    const user = session.user;

    // Verify lesson and course ownership
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        section: {
          include: { course: true },
        },
      },
    });

    if (!lesson) {
      return { error: "Lesson not found" };
    }

    if (
      lesson.section.course.instructorId !== user.id &&
      user.role !== "ADMIN"
    ) {
      return { error: "You don't have permission to delete this lesson" };
    }

    await prisma.lesson.delete({
      where: { id: lessonId },
    });

    revalidatePath(`/instructor/courses/${lesson.section.courseId}/content`);

    return { success: true };
  } catch (error) {
    console.error("Error deleting lesson:", error);
    return { error: "Failed to delete lesson" };
  }
}