// app/dashboard/DashboardClient.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  BookOpen, 
  Plus, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Award,
  ArrowRight,
  Eye,
  Edit,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';

type UserData = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: string;
};

type Course = {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string | null;
  price: number;
  isPublished: boolean;
  category: { name: string } | null;
  _count: {
    purchases: number;
    reviews: number;
  };
};

type Purchase = {
  id: string;
  createdAt: Date;
  course: {
    id: string;
    title: string;
    slug: string;
    description: string;
    thumbnail: string | null;
    instructor: {
      name: string;
      image: string | null;
    };
    category: { name: string } | null;
    _count: {
      reviews: number;
    };
  };
};

type InstructorStats = {
  totalCourses: number;
  publishedCourses: number;
  totalStudents: number;
  totalRevenue: number;
} | null;

type DashboardClientProps = {
  user: UserData;
  purchases: Purchase[];
  instructorCourses: Course[];
  instructorStats: InstructorStats;
};

export default function DashboardClient({ 
  user, 
  purchases, 
  instructorCourses, 
  instructorStats 
}: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState<'learning' | 'teaching'>('learning');
  const isInstructor = user.role === 'INSTRUCTOR' || user.role === 'ADMIN';

  const gradients = [
    "bg-gradient-to-br from-blue-500 to-purple-600",
    "bg-gradient-to-br from-pink-500 to-orange-500",
    "bg-gradient-to-br from-gray-800 to-gray-600",
    "bg-gradient-to-br from-green-500 to-teal-600",
    "bg-gradient-to-br from-red-500 to-pink-600",
    "bg-gradient-to-br from-indigo-500 to-blue-600",
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm uppercase tracking-widest text-gray-500 mb-4">
                Welcome back
              </div>
              <h1 className="text-5xl md:text-6xl font-black leading-none mb-4">
                {user.name}
              </h1>
              <p className="text-xl text-gray-600 font-light">
                {isInstructor ? 'Manage your courses and track your impact' : 'Continue your learning journey'}
              </p>
            </div>
            {isInstructor && (
              <Button size="lg" className="rounded-full" asChild>
                <Link href="/instructor/courses/create">
                  <Plus className="mr-2 h-5 w-5" />
                  Create Course
                </Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Tabs for Instructors */}
      {isInstructor && (
        <section className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('learning')}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  activeTab === 'learning'
                    ? 'bg-black text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <BookOpen className="inline-block w-4 h-4 mr-2" />
                My Learning
              </button>
              <button
                onClick={() => setActiveTab('teaching')}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  activeTab === 'teaching'
                    ? 'bg-black text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <Users className="inline-block w-4 h-4 mr-2" />
                My Teaching
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Learning Tab */}
      {(!isInstructor || activeTab === 'learning') && (
        <>
          {/* Stats Section for Learning */}
          <section className="py-12 bg-gray-50 border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-8 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <BookOpen className="w-10 h-10 text-gray-400" />
                  </div>
                  <div className="text-4xl font-black mb-2">{purchases.length}</div>
                  <div className="text-gray-600">Courses Enrolled</div>
                </div>

                <div className="bg-white rounded-2xl p-8 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <TrendingUp className="w-10 h-10 text-gray-400" />
                  </div>
                  <div className="text-4xl font-black mb-2">0</div>
                  <div className="text-gray-600">Courses Completed</div>
                </div>

                <div className="bg-white rounded-2xl p-8 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <Award className="w-10 h-10 text-gray-400" />
                  </div>
                  <div className="text-4xl font-black mb-2">0</div>
                  <div className="text-gray-600">Certificates Earned</div>
                </div>
              </div>
            </div>
          </section>

          {/* Purchased Courses */}
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold">My Courses</h2>
                <Button variant="outline" className="rounded-full" asChild>
                  <Link href="/courses">
                    Browse More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              {purchases.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-200">
                  <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No courses yet</h3>
                  <p className="text-gray-600 mb-6">Start your learning journey today</p>
                  <Button size="lg" className="rounded-full" asChild>
                    <Link href="/courses">
                      Explore Courses
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {purchases.map((purchase, index) => (
                    <Link
                      key={purchase.id}
                      href={`/courses/${purchase.course.slug}`}
                      className="group cursor-pointer bg-white rounded-2xl overflow-hidden border-2 border-gray-200 hover:border-black hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
                    >
                      <div className="relative h-48 overflow-hidden">
                        {purchase.course.thumbnail ? (
                          <Image
                            src={purchase.course.thumbnail}
                            alt={purchase.course.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className={`${gradients[index % gradients.length]} w-full h-full`} />
                        )}
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500"></div>
                        {purchase.course.category && (
                          <div className="absolute top-4 left-4">
                            <span className="bg-white px-4 py-1 rounded-full text-sm font-medium shadow-lg">
                              {purchase.course.category.name}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-2 group-hover:text-gray-600 transition-colors duration-300 line-clamp-2">
                          {purchase.course.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {purchase.course.description}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                          {purchase.course.instructor.image ? (
                            <div className="relative w-5 h-5 rounded-full overflow-hidden">
                              <Image
                                src={purchase.course.instructor.image}
                                alt={purchase.course.instructor.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full bg-gray-200" />
                          )}
                          <span>{purchase.course.instructor.name}</span>
                        </div>
                        <Button className="w-full rounded-full">
                          Continue Learning
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {/* Teaching Tab (for Instructors) */}
      {isInstructor && activeTab === 'teaching' && instructorStats && (
        <>
          {/* Instructor Stats */}
          <section className="py-12 bg-gray-50 border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid md:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl p-8 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <BookOpen className="w-10 h-10 text-gray-400" />
                  </div>
                  <div className="text-4xl font-black mb-2">{instructorStats.totalCourses}</div>
                  <div className="text-gray-600">Total Courses</div>
                </div>

                <div className="bg-white rounded-2xl p-8 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <Eye className="w-10 h-10 text-gray-400" />
                  </div>
                  <div className="text-4xl font-black mb-2">{instructorStats.publishedCourses}</div>
                  <div className="text-gray-600">Published</div>
                </div>

                <div className="bg-white rounded-2xl p-8 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <Users className="w-10 h-10 text-gray-400" />
                  </div>
                  <div className="text-4xl font-black mb-2">{instructorStats.totalStudents}</div>
                  <div className="text-gray-600">Total Students</div>
                </div>

                <div className="bg-white rounded-2xl p-8 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <DollarSign className="w-10 h-10 text-gray-400" />
                  </div>
                  <div className="text-4xl font-black mb-2">${instructorStats.totalRevenue.toFixed(0)}</div>
                  <div className="text-gray-600">Total Revenue</div>
                </div>
              </div>
            </div>
          </section>

          {/* Instructor Courses */}
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold">My Courses</h2>
                <Button className="rounded-full" asChild>
                  <Link href="/instructor/courses/create">
                    <Plus className="mr-2 h-5 w-5" />
                    Create New Course
                  </Link>
                </Button>
              </div>

              {instructorCourses.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-200">
                  <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No courses yet</h3>
                  <p className="text-gray-600 mb-6">Create your first course and start teaching</p>
                  <Button size="lg" className="rounded-full" asChild>
                    <Link href="/instructor/courses/create">
                      <Plus className="mr-2 h-5 w-5" />
                      Create Your First Course
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {instructorCourses.map((course, index) => (
                    <div
                      key={course.id}
                      className="bg-white rounded-2xl overflow-hidden border-2 border-gray-200 hover:shadow-xl transition-all duration-500"
                    >
                      <div className="relative h-48 overflow-hidden">
                        {course.thumbnail ? (
                          <Image
                            src={course.thumbnail}
                            alt={course.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className={`${gradients[index % gradients.length]} w-full h-full`} />
                        )}
                        <div className="absolute inset-0 bg-black/20"></div>
                        <div className="absolute top-4 left-4">
                          <span className={`px-4 py-1 rounded-full text-sm font-medium shadow-lg ${
                            course.isPublished 
                              ? 'bg-green-500 text-white' 
                              : 'bg-yellow-500 text-black'
                          }`}>
                            {course.isPublished ? 'Published' : 'Draft'}
                          </span>
                        </div>
                      </div>

                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-2 line-clamp-2">
                          {course.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {course.description}
                        </p>

                        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{course._count.purchases} students</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            <span>${course.price}</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button variant="outline" className="flex-1 rounded-full" asChild>
                            <Link href={`/instructor/courses/${course.id}/edit`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </Button>
                          <Button variant="outline" className="flex-1 rounded-full" asChild>
                            <Link href={`/instructor/courses/${course.id}/analytics`}>
                              <BarChart3 className="mr-2 h-4 w-4" />
                              Analytics
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {/* Become Instructor CTA (for non-instructors) */}
      {!isInstructor && (
        <section className="py-20 bg-black text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Ready to teach?
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Share your expertise with thousands of eager learners and earn revenue.
            </p>
            <Button size="lg" variant="outline" className="border-white hover:bg-white text-black rounded-full" asChild>
              <Link href="/become-instructor">
                Become an Instructor
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </section>
      )}

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}