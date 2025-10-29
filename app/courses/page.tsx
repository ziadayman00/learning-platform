// app/courses/page.tsx (Server Component with Dynamic Rendering)
import { Suspense } from 'react';
import prisma from "@/lib/prisma";
import CoursesClient from "./CoursesClient";
import CoursesHero from "./CoursesHero";
import CoursesSkeleton from "./CoursesSkeleton";

// Force dynamic rendering - prevents static generation
export const dynamic = 'force-dynamic';

// This fetches courses (will be streamed)
async function CoursesList() {
  const courses = await prisma.course.findMany({
    where: {
      isPublished: true,
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
          slug: true,
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
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Calculate average rating for each course
  const coursesWithRatings = courses.map(course => {
    const avgRating = course.reviews.length > 0
      ? course.reviews.reduce((sum, review) => sum + review.rating, 0) / course.reviews.length
      : 0;
    
    return {
      ...course,
      averageRating: Number(avgRating.toFixed(1)),
    };
  });

  const categories = await prisma.category.findMany({
    select: {
      name: true,
      slug: true,
    },
    orderBy: {
      name: 'asc',
    },
  });

  return <CoursesClient courses={coursesWithRatings} categories={categories} />;
}

export default function CoursesPage() {
  return (
    <>
      {/* Hero loads immediately - no data fetching needed */}
      <CoursesHero />
      
      {/* Courses section with Suspense - streams in when ready */}
      <Suspense fallback={<CoursesSkeleton />}>
        <CoursesList />
      </Suspense>
    </>
  );
}