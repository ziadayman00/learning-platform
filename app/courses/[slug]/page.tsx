// app/courses/[slug]/page.tsx (Server Component with Streaming)
import { Suspense } from 'react';
import  prisma  from "@/lib/prisma";
import { notFound } from "next/navigation";
import CourseDetailClient from "./CourseDetailClient";
import CourseDetailSkeleton from './CourseDetailSkeleton';

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

// Separate component for course data fetching
async function CourseContent({ slug }: { slug: string }) {
  const course = await prisma.course.findUnique({
    where: {
      slug: slug,
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
          createdAt: 'desc',
        },
      },
      _count: {
        select: {
          purchases: true,
          reviews: true,
        },
      },
    },
  });

  if (!course) {
    notFound();
  }

  // Calculate average rating
  const averageRating = course.reviews.length > 0
    ? course.reviews.reduce((sum, review) => sum + review.rating, 0) / course.reviews.length
    : 0;

  // Fetch related courses from the same category
  const relatedCourses = course.categoryId ? await prisma.course.findMany({
    where: {
      categoryId: course.categoryId,
      isPublished: true,
      NOT: {
        id: course.id,
      },
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
  }) : [];

  // Calculate average ratings for related courses
  const relatedCoursesWithRatings = relatedCourses.map(relCourse => {
    const avgRating = relCourse.reviews.length > 0
      ? relCourse.reviews.reduce((sum, review) => sum + review.rating, 0) / relCourse.reviews.length
      : 0;
    
    return {
      ...relCourse,
      averageRating: Number(avgRating.toFixed(1)),
    };
  });

  const courseWithRating = {
    ...course,
    averageRating: Number(averageRating.toFixed(1)),
  };

  return <CourseDetailClient course={courseWithRating} relatedCourses={relatedCoursesWithRatings} />;
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params;

  return (
    <Suspense fallback={<CourseDetailSkeleton />}>
      <CourseContent slug={slug} />
    </Suspense>
  );
}

// Generate static params for all published courses (for static generation)
export async function generateStaticParams() {
  const courses = await prisma.course.findMany({
    where: {
      isPublished: true,
    },
    select: {
      slug: true,
    },
  });

  return courses.map((course) => ({
    slug: course.slug,
  }));
}