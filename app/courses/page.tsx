// app/courses/page.tsx (Server Component)
import  prisma  from "@/lib/prisma"; // Adjust path to your Prisma client
import CoursesClient from "./CoursesClient";

export default async function CoursesPage() {
  // Fetch courses with related data from database
  const courses = await prisma.course.findMany({
    where: {
      isPublished: true,
    },
    include: {
      instructor: {
        select: {
          name: true,
        },
      },
      category: {
        select: {
          name: true,
        },
      },
      _count: {
        select: {
          purchases: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Fetch all categories for the filter
  const categories = await prisma.category.findMany({
    select: {
      name: true,
      slug: true,
    },
  });

  return <CoursesClient courses={courses} categories={categories} />;
}