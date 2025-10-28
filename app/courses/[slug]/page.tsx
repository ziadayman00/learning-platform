// app/courses/[slug]/page.tsx
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import CourseDetailClient from "./CourseDetailClient";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CourseDetailPage({ params }: PageProps) {
  const { slug } = await params;

  // Check if user is authenticated
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userId = session?.user?.id;

  // Fetch the course
  const course = await prisma.course.findUnique({
    where: {
      slug,
      isPublished: true,
    },
    include: {
      instructor: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          _count: {
            select: {
              courses: true,
            },
          },
        },
      },
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      sections: {
        include: {
          lessons: {
            orderBy: { position: "asc" },
          },
        },
        orderBy: { position: "asc" },
      },
      _count: {
        select: {
          purchases: true,
          reviews: true,
        },
      },
      reviews: {
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
      },
    },
  });

  if (!course) {
    notFound();
  }

  // Check if user has purchased the course
  let hasPurchased = false;
  if (userId) {
    const purchase = await prisma.purchase.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: course.id,
        },
        paymentStatus: "COMPLETED",
      },
    });
    hasPurchased = !!purchase;
  }

  // Check if user is the instructor
  const isInstructor = userId === course.instructor.id;

  // Keep all lessons visible, but mark which ones are accessible
  const filteredSections = course.sections;

  // Calculate average rating
  const avgRating =
    course.reviews.length > 0
      ? course.reviews.reduce((sum, review) => sum + review.rating, 0) /
        course.reviews.length
      : 0;

  // Fetch related courses
  const relatedCourses = await prisma.course.findMany({
    where: {
      categoryId: course.categoryId,
      isPublished: true,
      id: { not: course.id },
    },
    include: {
      instructor: {
        select: {
          name: true,
          image: true,
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
          reviews: true,
        },
      },
      reviews: {
        select: {
          rating: true,
        },
      },
    },
    take: 3,
    orderBy: {
      purchases: {
        _count: "desc",
      },
    },
  });

  // Calculate average ratings for related courses
  const relatedCoursesWithRatings = relatedCourses.map((relatedCourse) => {
    const avgRating =
      relatedCourse.reviews.length > 0
        ? relatedCourse.reviews.reduce((sum, review) => sum + review.rating, 0) /
          relatedCourse.reviews.length
        : 0;

    return {
      ...relatedCourse,
      averageRating: Number(avgRating.toFixed(1)),
    };
  });

  return (
    <CourseDetailClient
      course={{
        ...course,
        sections: filteredSections,
        averageRating: Number(avgRating.toFixed(1)),
      }}
      relatedCourses={relatedCoursesWithRatings}
      hasPurchased={hasPurchased}
      isInstructor={isInstructor}
    />
  );
}