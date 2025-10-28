// app/courses/[slug]/learn/page.tsx
import { redirect, notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import CourseLearningClient from "./CourseLearningClient";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    lesson?: string;
    enrolled?: string;
  }>;
};

export default async function CourseLearningPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { lesson: lessonId, enrolled } = await searchParams;

  // Check authentication
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect(`/signin?redirect=/courses/${slug}/learn`);
  }

  const userId = session.user.id;

  // Fetch course with all content
  const course = await prisma.course.findUnique({
    where: { slug, isPublished: true },
    include: {
      instructor: {
        select: {
          id: true,
          name: true,
          image: true,
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
    },
  });

  if (!course) {
    notFound();
  }

  // Check if user purchased the course or is the instructor
  const isInstructor = userId === course.instructor.id;

  if (!isInstructor) {
    const purchase = await prisma.purchase.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: course.id,
        },
        paymentStatus: "COMPLETED",
      },
    });

    if (!purchase) {
      redirect(`/courses/${slug}`);
    }
  }

  // Get user's progress for all lessons
  const progressRecords = await prisma.lessonProgress.findMany({
    where: {
      userId,
      lesson: {
        section: {
          courseId: course.id,
        },
      },
    },
    select: {
      lessonId: true,
      isCompleted: true,
      lastPosition: true,
    },
  });

  // Convert to map for easy lookup
  const progressMap = progressRecords.reduce((acc, record) => {
    acc[record.lessonId] = {
      isCompleted: record.isCompleted,
      lastPosition: record.lastPosition,
    };
    return acc;
  }, {} as Record<string, { isCompleted: boolean; lastPosition: number }>);

  // Get user's review if exists
  const userReview = await prisma.review.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId: course.id,
      },
    },
    select: {
      rating: true,
      comment: true,
    },
  });

  // Find the lesson to play (from URL or first lesson)
  let currentLesson = null;
  let currentSectionId = null;

  if (lessonId) {
    // Find the specific lesson
    for (const section of course.sections) {
      const lesson = section.lessons.find((l) => l.id === lessonId);
      if (lesson) {
        currentLesson = lesson;
        currentSectionId = section.id;
        break;
      }
    }
  }

  // If no lesson found, get the first lesson
  if (!currentLesson && course.sections.length > 0) {
    const firstSection = course.sections[0];
    if (firstSection.lessons.length > 0) {
      currentLesson = firstSection.lessons[0];
      currentSectionId = firstSection.id;
    }
  }

  if (!currentLesson) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">No lessons available</h1>
          <p className="text-gray-600">
            This course doesn't have any lessons yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <CourseLearningClient
      course={course}
      currentLesson={currentLesson}
      currentSectionId={currentSectionId}
      progressMap={progressMap}
      showEnrollSuccess={enrolled === "true"}
      userReview={userReview}
    />
  );
}