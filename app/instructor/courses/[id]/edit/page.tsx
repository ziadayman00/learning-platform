// app/instructor/courses/[id]/edit/page.tsx
import { redirect, notFound } from 'next/navigation';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import prisma from '@/lib/prisma';
import DeleteCourseButton from '@/app/components/forms/DeleteCourseButton';
import CourseForm from '@/app/components/forms/CourseForm';
import InstructorCourseNav from '@/app/components/instructor/InstructorCourseNav';

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditCoursePage({ params }: PageProps) {
  // Await params (Next.js 15+)
  const { id } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect('/signin');
  }

  const user = session.user;

  // Fetch the course
  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      _count: {
        select: {
          purchases: true,
        },
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
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="text-sm uppercase tracking-widest text-gray-500 mb-4">
                Edit Course
              </div>
              <h1 className="text-5xl md:text-6xl font-black leading-none mb-4">
                {course.title}
              </h1>
              <div className="flex items-center gap-4 text-gray-600">
                <span className={`px-4 py-1 rounded-full text-sm font-medium ${
                  course.isPublished 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {course.isPublished ? 'Published' : 'Draft'}
                </span>
                <span className="text-sm">
                  {course._count.purchases} {course._count.purchases === 1 ? 'student' : 'students'}
                </span>
              </div>
            </div>
            
            {/* Delete Button */}
            <DeleteCourseButton
              courseId={course.id} 
              courseName={course.title}
              hasStudents={course._count.purchases > 0}
            />
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 bg-gray-50 flex-grow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <InstructorCourseNav courseId={course.id} />
          <CourseForm
            categories={categories} 
            mode="edit"
            course={{
              id: course.id,
              title: course.title,
              description: course.description,
              price: course.price,
              thumbnail: course.thumbnail,
              isPublished: course.isPublished,
              categoryId: course.categoryId,
            }}
          />
        </div>
      </section>
    </div>
  );
}