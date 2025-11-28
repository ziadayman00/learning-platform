// app/instructor/courses/[id]/content/page.tsx
import { redirect, notFound } from 'next/navigation';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import CourseContentClient from './CoursesContentClient';
import InstructorCourseNav from '@/app/components/instructor/InstructorCourseNav';

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CourseContentPage({ params }: PageProps) {
  const { id } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect('/signin');
  }

  const user = session.user;

  // Fetch the course with sections and lessons
  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      sections: {
        include: {
          lessons: {
            orderBy: { position: 'asc' },
          },
        },
        orderBy: { position: 'asc' },
      },
    },
  });

  if (!course) {
    notFound();
  }

  // Check if user owns this course
  if (course.instructorId !== user.id && user.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Button
            variant="outline"
            className="rounded-full mb-6"
            asChild
          >
            <Link href={`/instructor/courses/${id}/edit`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Course
            </Link>
          </Button>

          <div className="text-sm uppercase tracking-widest text-gray-500 mb-4">
            Course Content
          </div>
          <h1 className="text-5xl md:text-6xl font-black leading-none mb-4">
            {course.title}
          </h1>
          <p className="text-xl text-gray-600 font-light">
            Add sections and lessons to build your course curriculum
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-gray-50 flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <InstructorCourseNav courseId={course.id} />
          <CourseContentClient course={course} />
        </div>
      </section>
    </div>
  );
}