// app/instructor/courses/[id]/analytics/page.tsx
import { redirect, notFound } from 'next/navigation';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, DollarSign, Star, TrendingUp } from 'lucide-react';
import InstructorCourseNav from '@/app/components/instructor/InstructorCourseNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CourseAnalyticsPage({ params }: PageProps) {
  const { id } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect('/signin');
  }

  const user = session.user;

  // Fetch the course with analytics data
  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          purchases: true,
          reviews: true,
        },
      },
      purchases: {
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          user: {
            select: {
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
      reviews: {
        select: {
          rating: true,
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

  // Calculate metrics
  const totalRevenue = course.purchases.reduce((acc, purchase) => acc + purchase.amount, 0);
  const totalStudents = course._count.purchases;
  const averageRating = course.reviews.length > 0
    ? course.reviews.reduce((acc, review) => acc + review.rating, 0) / course.reviews.length
    : 0;

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
            Analytics
          </div>
          <h1 className="text-5xl md:text-6xl font-black leading-none mb-4">
            {course.title}
          </h1>
          <p className="text-xl text-gray-600 font-light">
            Track your course performance and student engagement
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-gray-50 flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <InstructorCourseNav courseId={course.id} />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total Revenue */}
            <Card className="rounded-3xl border-2 border-gray-100 shadow-none">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  Lifetime earnings
                </p>
              </CardContent>
            </Card>

            {/* Total Students */}
            <Card className="rounded-3xl border-2 border-gray-100 shadow-none">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalStudents}</div>
                <p className="text-xs text-muted-foreground">
                  Enrolled students
                </p>
              </CardContent>
            </Card>

            {/* Average Rating */}
            <Card className="rounded-3xl border-2 border-gray-100 shadow-none">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
                <p className="text-xs text-muted-foreground">
                  Based on {course._count.reviews} reviews
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Enrollments */}
          <Card className="rounded-3xl border-2 border-gray-100 shadow-none">
            <CardHeader>
              <CardTitle>Recent Enrollments</CardTitle>
            </CardHeader>
            <CardContent>
              {course.purchases.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No enrollments yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {course.purchases.map((purchase) => (
                    <div key={purchase.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-black text-white flex items-center justify-center font-bold">
                          {purchase.user.name?.[0] || 'U'}
                        </div>
                        <div>
                          <p className="font-semibold">{purchase.user.name}</p>
                          <p className="text-sm text-gray-500">{purchase.user.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${purchase.amount.toFixed(2)}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(purchase.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
