// app/instructor/courses/create/page.tsx
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import prisma from '@/lib/prisma';
import CourseForm from '@/app/components/forms/CourseForm';

export default async function CreateCoursePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect('/signin');
  }

  const user = session.user;

  // Check if user is instructor
  if (user.role !== 'INSTRUCTOR' && user.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  // Fetch categories
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
    },
    orderBy: {
      name: 'asc',
    },
  });

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-sm uppercase tracking-widest text-gray-500 mb-4">
            Instructor Dashboard
          </div>
          <h1 className="text-5xl md:text-6xl font-black leading-none mb-4">
            Create a new course
          </h1>
          <p className="text-xl text-gray-600 font-light">
            Share your knowledge with thousands of eager learners
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 bg-gray-50 flex-grow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <CourseForm categories={categories} mode="create" />
        </div>
      </section>
    </div>
  );
}