// app/actions/courses.ts
"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

// Helper to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Create Course
export async function createCourse(formData: FormData) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    const user = session.user;

    // Check if user is instructor
    if (user.role !== "INSTRUCTOR" && user.role !== "ADMIN") {
      return { error: "Only instructors can create courses" };
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const categoryId = formData.get("categoryId") as string;
    const thumbnail = formData.get("thumbnail") as string;
    const isPublished = formData.get("isPublished") === "true";

    // Validation
    if (!title || !description || !price || !categoryId) {
      return { error: "Please fill in all required fields" };
    }

    if (price < 0) {
      return { error: "Price must be a positive number" };
    }

    // Generate unique slug
    let slug = generateSlug(title);
    let slugExists = await prisma.course.findUnique({ where: { slug } });
    let counter = 1;

    while (slugExists) {
      slug = `${generateSlug(title)}-${counter}`;
      slugExists = await prisma.course.findUnique({ where: { slug } });
      counter++;
    }

    // Create course
    const course = await prisma.course.create({
      data: {
        title,
        slug,
        description,
        price,
        thumbnail: thumbnail || null,
        isPublished,
        instructorId: user.id,
        categoryId,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/courses");
    
    return { success: true, courseId: course.id };
  } catch (error) {
    console.error("Error creating course:", error);
    return { error: "Failed to create course" };
  }
}

// Update Course
export async function updateCourse(courseId: string, formData: FormData) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    const user = session.user;

    // Check if course exists and belongs to user
    const existingCourse = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!existingCourse) {
      return { error: "Course not found" };
    }

    if (existingCourse.instructorId !== user.id && user.role !== "ADMIN") {
      return { error: "You don't have permission to edit this course" };
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const categoryId = formData.get("categoryId") as string;
    const thumbnail = formData.get("thumbnail") as string;
    const isPublished = formData.get("isPublished") === "true";

    // Validation
    if (!title || !description || !price || !categoryId) {
      return { error: "Please fill in all required fields" };
    }

    if (price < 0) {
      return { error: "Price must be a positive number" };
    }

    // Update slug if title changed
    let slug = existingCourse.slug;
    if (title !== existingCourse.title) {
      slug = generateSlug(title);
      let slugExists = await prisma.course.findUnique({ where: { slug } });
      let counter = 1;

      while (slugExists && slugExists.id !== courseId) {
        slug = `${generateSlug(title)}-${counter}`;
        slugExists = await prisma.course.findUnique({ where: { slug } });
        counter++;
      }
    }

    // Update course
    await prisma.course.update({
      where: { id: courseId },
      data: {
        title,
        slug,
        description,
        price,
        thumbnail: thumbnail || null,
        isPublished,
        categoryId,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/courses");
    revalidatePath(`/courses/${slug}`);
    
    return { success: true };
  } catch (error) {
    console.error("Error updating course:", error);
    return { error: "Failed to update course" };
  }
}

// Delete Course
export async function deleteCourse(courseId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    const user = session.user;

    // Check if course exists and belongs to user
    const existingCourse = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        _count: {
          select: {
            purchases: true,
          },
        },
      },
    });

    if (!existingCourse) {
      return { error: "Course not found" };
    }

    if (existingCourse.instructorId !== user.id && user.role !== "ADMIN") {
      return { error: "You don't have permission to delete this course" };
    }

    // Check if course has purchases
    if (existingCourse._count.purchases > 0) {
      return { error: "Cannot delete course with active students. Consider unpublishing instead." };
    }

    // Delete course
    await prisma.course.delete({
      where: { id: courseId },
    });

    revalidatePath("/dashboard");
    revalidatePath("/courses");
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting course:", error);
    return { error: "Failed to delete course" };
  }
}

// Toggle Publish Status
export async function togglePublishCourse(courseId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    const user = session.user;

    // Check if course exists and belongs to user
    const existingCourse = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!existingCourse) {
      return { error: "Course not found" };
    }

    if (existingCourse.instructorId !== user.id && user.role !== "ADMIN") {
      return { error: "You don't have permission to edit this course" };
    }

    // Toggle publish status
    await prisma.course.update({
      where: { id: courseId },
      data: {
        isPublished: !existingCourse.isPublished,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/courses");
    
    return { success: true, isPublished: !existingCourse.isPublished };
  } catch (error) {
    console.error("Error toggling publish status:", error);
    return { error: "Failed to update publish status" };
  }
}