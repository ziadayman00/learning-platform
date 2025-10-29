// app/instructor/courses/page.tsx
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen, ArrowLeft, Edit, FileText, Play } from "lucide-react";

export default async function InstructorCoursesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/signin");
  }

  const user = session.user;

  // Check if user is an instructor
  if (user.role !== "INSTRUCTOR" && user.role !== "ADMIN") {
    redirect("/become-instructor");
  }

  // Fetch all instructor's courses
  const courses = await prisma.course.findMany({
    where: { instructorId: user.id },
    include: {
      _count: {
        select: {
          purchases: true, // ✅ Use purchases instead
          sections: true,
        },
      },
      sections: {
        include: {
          _count: {
            select: { lessons: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Button variant="outline" className="rounded-full mb-6" asChild>
            <Link href="/instructor">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>

          <div className="flex items-end justify-between">
            <div>
              <div className="text-sm uppercase tracking-widest text-gray-500 mb-4">
                Your Courses
              </div>
              <h1 className="text-5xl md:text-6xl font-black leading-none mb-4">
                Manage courses
              </h1>
              <p className="text-xl text-gray-600 font-light">
                {courses.length} {courses.length === 1 ? "course" : "courses"}{" "}
                created
              </p>
            </div>
            <Button size="lg" className="rounded-full h-14 px-8" asChild>
              <Link href="/instructor/courses/create">
                <Plus className="mr-2 h-5 w-5" />
                Create Course
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Courses List */}
      <section className="py-16 bg-gray-50 flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {courses.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-300">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No courses yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start sharing your knowledge by creating your first course
              </p>
              <Button size="lg" className="rounded-full" asChild>
                <Link href="/instructor/courses/create">
                  <Plus className="mr-2 h-5 w-5" />
                  Create Your First Course
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {courses.map((course) => {
                const totalLessons = course.sections.reduce(
                  (sum: number, section: any) => sum + section._count.lessons,
                  0
                );

                return (
                  <div
                    key={course.id}
                    className="bg-white rounded-3xl border-2 border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* Thumbnail */}
                      <div className="md:w-80 h-48 md:h-auto flex-shrink-0">
                        {course.thumbnail ? (
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                            <BookOpen className="w-16 h-16 text-gray-300" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-8">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <span
                                className={`text-xs font-bold px-4 py-1.5 rounded-full ${
                                  course.isPublished
                                    ? "bg-green-100 text-green-700"
                                    : "bg-yellow-100 text-yellow-700"
                                }`}
                              >
                                {course.isPublished ? "PUBLISHED" : "DRAFT"}
                              </span>{" "}
                            </div>

                            <h3 className="text-3xl font-bold mb-3">
                              {course.title}
                            </h3>

                            {course.description && (
                              <p className="text-gray-600 leading-relaxed mb-4 line-clamp-2">
                                {course.description}
                              </p>
                            )}

                            <div className="flex items-center gap-6 text-sm text-gray-600">
                              <span className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4" />
                                {course._count.sections} sections
                              </span>
                              <span className="flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                {totalLessons} lessons
                              </span>
                              <span>{course._count.purchases} students</span>
                              <span className="text-xl font-black text-gray-900">
                                ${course.price}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-full border-2 border-gray-200"
                              asChild
                            >
                              <Link href={`/courses/${course.slug}/learn`}>
                                <Play className="mr-2 h-4 w-4" />
                                Preview
                              </Link>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-full border-2 border-gray-200"
                              asChild
                            >
                              <Link
                                href={`/instructor/courses/${course.id}/edit`}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </Link>
                            </Button>
                            <Button size="sm" className="rounded-full" asChild>
                              <Link
                                href={`/instructor/courses/${course.id}/content`}
                              >
                                <BookOpen className="mr-2 h-4 w-4" />
                                Content
                              </Link>
                            </Button>
                          </div>{" "}
                        </div>

                        {/* Progress Bar (if course has sections) */}
                        {course._count.sections > 0 && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex items-center justify-between text-sm mb-2">
                              <span className="text-gray-600">
                                Course Completion
                              </span>
                              <span className="font-semibold">
                                {totalLessons > 0 ? "100%" : "0%"}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-black rounded-full h-2 transition-all duration-500"
                                style={{
                                  width: totalLessons > 0 ? "100%" : "0%",
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
