// app/courses/[slug]/CourseDetailClient.tsx (Client Component)
"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Star,
  User,
  Users,
  CheckCircle,
  Play,
  Award,
  Share2,
  StarHalf,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import { ChevronDown, ChevronUp } from "lucide-react";
import EnrollButton from "@/app/components/checkout/EnrollButton";
import VideoPlayerModal from "@/app/components/course-content/VideoPlayerModal";

type Review = {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  user: {
    name: string;
    image: string | null;
  };
};

type Lesson = {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string;
  duration: number | null;
  isFree: boolean;
  position: number;
};

type Section = {
  id: string;
  title: string;
  description: string | null;
  position: number;
  lessons: Lesson[];
};

type Course = {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string | null;
  price: number;
  instructor: {
    id: string;
    name: string;
    email: string | null;
    image: string | null;
    _count: {
      courses: number;
    };
  };
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
  sections: Section[]; // ADD THIS LINE
  _count: {
    purchases: number;
    reviews: number;
  };
  reviews: Review[];
  averageRating: number;
};

type RelatedCourse = {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string | null;
  price: number;
  instructor: {
    name: string;
    image: string | null;
  };
  category: {
    name: string;
  } | null;
  _count: {
    purchases: number;
    reviews: number;
  };
  averageRating: number;
};

type CourseDetailClientProps = {
  course: Course;
  relatedCourses: RelatedCourse[];
  hasPurchased: boolean;
  isInstructor: boolean;
  
};

function CurriculumSections({
  sections,
  formatDuration,
  onPlayLesson,
}: {
  sections: any[];
  formatDuration: (seconds: number | null) => string;
  onPlayLesson: (lesson: any) => void;
}) {
  const [openSections, setOpenSections] = useState<string[]>([sections[0]?.id]); // First section open by default

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  return (
    <div className="space-y-4">
      {sections.map((section: any, sectionIndex) => {
        const isOpen = openSections.includes(section.id);

        return (
          <div
            key={section.id}
            className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden"
          >
            {/* Section Header - Clickable */}
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full bg-gray-50 border-b border-gray-200 p-6 hover:bg-gray-100 transition-colors text-left"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-black text-white rounded-full px-4 py-1 text-sm font-bold">
                      Section {sectionIndex + 1}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {section.lessons.length}{" "}
                      {section.lessons.length === 1 ? "lesson" : "lessons"}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {section.title}
                  </h3>
                  {section.description && (
                    <p className="text-gray-600">{section.description}</p>
                  )}
                </div>
                <div className="flex-shrink-0">
                  {isOpen ? (
                    <ChevronUp className="w-6 h-6 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-gray-600" />
                  )}
                </div>
              </div>
            </button>

            {/* Lessons List - Collapsible */}
            {isOpen && (
              <div className="p-4 space-y-2">
                {section.lessons.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No lessons yet
                  </div>
                ) : (
                  section.lessons.map((lesson: any) => (
                    <div
                      key={lesson.id}
                      onClick={() => {
                        if (lesson.isFree) {
                          onPlayLesson(lesson);
                        }
                      }}
                      className={`flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors ${
                        lesson.isFree ? 'cursor-pointer' : ''
                      }`}
                    >
                      <div className="bg-white rounded-full p-2 border-2 border-gray-200">
                        <Play
                          className={`w-5 h-5 ${
                            lesson.isFree ? "text-green-600" : "text-gray-400"
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-gray-900">
                            {lesson.title}
                          </p>
                          {lesson.isFree && (
                            <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                              <CheckCircle className="w-3 h-3" />
                              Free Preview
                            </span>
                          )}
                        </div>
                        {lesson.description && (
                          <p className="text-sm text-gray-600 line-clamp-1">
                            {lesson.description}
                          </p>
                        )}
                      </div>
                      <span className="text-sm text-gray-500 font-medium">
                        {formatDuration(lesson.duration)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function CourseDetailClient({
  course,
  relatedCourses,
  hasPurchased, // Make sure this is here
  isInstructor, // This too if you have it
}: CourseDetailClientProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "curriculum" | "reviews"
  >("overview");
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<{ url: string; title: string } | null>(null);

  // Get first free lesson
  const firstFreeLesson = course.sections
    .flatMap(section => section.lessons)
    .find(lesson => lesson.isFree);

  const gradients = [
    "bg-gradient-to-br from-blue-500 to-purple-600",
    "bg-gradient-to-br from-pink-500 to-orange-500",
    "bg-gradient-to-br from-gray-800 to-gray-600",
    "bg-gradient-to-br from-green-500 to-teal-600",
  ];

  const features = [
    "Lifetime access to course materials",
    "Downloadable resources and exercises",
    "Certificate of completion",
    "Access on mobile and desktop",
    "Direct support from instructor",
  ];

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`full-${i}`}
          className="w-5 h-5 fill-yellow-400 text-yellow-400"
        />
      );
    }
    if (hasHalfStar) {
      stars.push(
        <StarHalf
          key="half"
          className="w-5 h-5 fill-yellow-400 text-yellow-400"
        />
      );
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-5 h-5 text-gray-300" />);
    }
    return stars;
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "N/A";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

const totalLessons = course.sections.reduce(
  (sum: number, section: any) => sum + section.lessons.length,
  0
);

const freeLessons = course.sections.reduce(
  (sum: number, section) => sum + section.lessons.filter((l: any) => l.isFree).length,
  0
);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Breadcrumb */}
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link
              href="/courses"
              className="hover:text-black transition-colors"
            >
              Courses
            </Link>
            {course.category && (
              <>
                <span>/</span>
                <Link
                  href={`/courses?category=${course.category.slug}`}
                  className="hover:text-black transition-colors"
                >
                  {course.category.name}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-black font-medium">{course.title}</span>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              {course.category && (
                <div className="inline-block bg-white/10 px-4 py-2 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
                  {course.category.name}
                </div>
              )}
              <h1 className="text-5xl md:text-6xl font-black leading-tight mb-6">
                {course.title}
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed mb-8">
                {course.description}
              </p>

              {/* Instructor & Stats */}
              <div className="flex flex-wrap items-center gap-6 mb-8 text-gray-300">
                <div className="flex items-center gap-2">
                  {course.instructor.image ? (
                    <div className="relative w-6 h-6 rounded-full overflow-hidden">
                      <Image
                        src={course.instructor.image}
                        alt={course.instructor.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                  <span className="font-medium">{course.instructor.name}</span>
                </div>
                {course.averageRating > 0 && (
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">
                      {course.averageRating} ({course._count.reviews} reviews)
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>
                    {course._count.purchases.toLocaleString()} students
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="h-14 px-8 text-lg rounded-full">
                  Enroll Now - ${course.price}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-8 text-lg rounded-full border-white hover:bg-white text-black"
                >
                  <Share2 className="mr-2 w-5 h-5" />
                  Share Course
                </Button>
              </div>
            </div>

            {/* Course Preview Card */}
            <div className="relative">
              <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border-4 border-gray-800  transition-transform duration-500">
                <div className="relative h-64 overflow-hidden">
                  {course.thumbnail ? (
                    <Image
                      src={course.thumbnail}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-full h-full" />
                  )}
                  {firstFreeLesson ? (
                    <div 
                      onClick={() => {
                        setSelectedVideo({ url: firstFreeLesson.videoUrl, title: firstFreeLesson.title });
                        setVideoModalOpen(true);
                      }}
                      className="absolute inset-0 bg-black/40 hover:bg-black/20 transition-colors duration-300 flex items-center justify-center group cursor-pointer"
                    >
                      <div className="bg-white rounded-full p-6 shadow-2xl group-hover:scale-110 transition-transform duration-300">
                        <Play className="w-12 h-12 text-black" />
                      </div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="bg-white rounded-full p-6 shadow-2xl opacity-50">
                        <Play className="w-12 h-12 text-black" />
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium">
                    {firstFreeLesson ? 'Watch Free Preview' : 'No Preview Available'}
                  </div>
                </div>
                <div className="p-8 text-black">
                  <h3 className="text-2xl font-bold mb-4">
                    This course includes:
                  </h3>
                  <ul className="space-y-3">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("overview")}
              className={`py-6 font-bold text-lg border-b-4 transition-colors duration-300 ${
                activeTab === "overview"
                  ? "border-black text-black"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("curriculum")}
              className={`py-6 font-bold text-lg border-b-4 transition-colors duration-300 ${
                activeTab === "curriculum"
                  ? "border-black text-black"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              Curriculum ({totalLessons} lessons)
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`py-6 font-bold text-lg border-b-4 transition-colors duration-300 ${
                activeTab === "reviews"
                  ? "border-black text-black"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              Reviews ({course._count.reviews})
            </button>
          </div>
        </div>
      </section>
      {/* Content Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {activeTab === "overview" ? (
                <div className="space-y-8">
                  <div className="bg-white rounded-2xl p-8 border border-gray-200">
                    <h2 className="text-3xl font-bold mb-6">
                      Course Description
                    </h2>
                    <div className="prose prose-lg max-w-none">
                      <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {course.description}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-8 border border-gray-200">
                    <h2 className="text-3xl font-bold mb-6">
                      About the Instructor
                    </h2>
                    <div className="flex items-start gap-4 mb-6">
                      <div className="relative w-20 h-20 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
                        {course.instructor.image ? (
                          <Image
                            src={course.instructor.image}
                            alt={course.instructor.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User className="w-10 h-10 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold mb-2">
                          {course.instructor.name}
                        </h3>
                        <p className="text-gray-600 mb-2">
                          {course.instructor._count.courses} courses
                        </p>
                        <p className="text-gray-600">
                          {course._count.purchases} total students
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : activeTab === "curriculum" ? (
                <div className="space-y-6">
                  {/* Curriculum Stats */}
                  <div className="bg-white rounded-2xl p-8 border border-gray-200">
                    <div className="flex flex-wrap items-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-gray-400" />
                        <span className="font-semibold">
                          {course.sections.length} sections
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Play className="w-5 h-5 text-gray-400" />
                        <span className="font-semibold">
                          {totalLessons} lessons
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="font-semibold">
                          {freeLessons} free preview
                          {freeLessons !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Sections List */}
                  {course.sections.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 border border-gray-200 text-center">
                      <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        No curriculum yet
                      </h3>
                      <p className="text-gray-600">
                        The instructor is still building this course.
                      </p>
                    </div>
                  ) : (
                    <CurriculumSections
                      sections={course.sections}
                      formatDuration={formatDuration}
                      onPlayLesson={(lesson) => {
                        console.log("Playing lesson:", lesson);
                        setSelectedVideo({ url: lesson.videoUrl, title: lesson.title });
                        setVideoModalOpen(true);
                      }}
                    />
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Reviews Summary */}
                  {course.averageRating > 0 && (
                    <div className="bg-white rounded-2xl p-8 border border-gray-200">
                      <div className="flex items-center gap-8 mb-8">
                        <div className="text-center">
                          <div className="text-6xl font-black mb-2">
                            {course.averageRating}
                          </div>
                          <div className="flex items-center justify-center gap-1 mb-2">
                            {renderStars(course.averageRating)}
                          </div>
                          <p className="text-gray-600">
                            {course._count.reviews} reviews
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Individual Reviews */}
                  {course.reviews.length > 0 ? (
                    <div className="space-y-4">
                      {course.reviews.map((review) => (
                        <div
                          key={review.id}
                          className="bg-white rounded-2xl p-8 border border-gray-200"
                        >
                          <div className="flex items-start gap-4">
                            <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
                              {review.user.image ? (
                                <Image
                                  src={review.user.image}
                                  alt={review.user.name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <User className="w-6 h-6 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-bold text-lg">
                                  {review.user.name}
                                </h4>
                                <span className="text-sm text-gray-500">
                                  {formatDate(review.createdAt)}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 mb-3">
                                {renderStars(review.rating)}
                              </div>
                              {review.comment && (
                                <p className="text-gray-700 leading-relaxed">
                                  {review.comment}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl p-12 border border-gray-200 text-center">
                      <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        No reviews yet
                      </h3>
                      <p className="text-gray-600">
                        Be the first to review this course!
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

{/* Sidebar */}
<div className="lg:col-span-1">
  <div className="bg-white rounded-2xl p-8 border border-gray-200 sticky top-24">
    <div className="text-center mb-6">
      <div className="text-5xl font-black mb-2">
        ${course.price}
      </div>
      <p className="text-gray-600">
        One-time payment • Lifetime access
      </p>
    </div>

    {/* زر Enroll Now الجديد */}
    <EnrollButton course={course} hasPurchased={hasPurchased}/>

    <p className="text-center text-sm text-gray-500 mb-6">
      30-day money-back guarantee
    </p>

    <div className="border-t border-gray-200 pt-6 space-y-4">
      <div className="flex items-center gap-3">
        <Award className="w-5 h-5 text-gray-400" />
        <span className="text-sm text-gray-700">
          Certificate of completion
        </span>
      </div>
      <div className="flex items-center gap-3">
        <Users className="w-5 h-5 text-gray-400" />
        <span className="text-sm text-gray-700">
          {course._count.purchases} students enrolled
        </span>
      </div>
      <div className="flex items-center gap-3">
        <BookOpen className="w-5 h-5 text-gray-400" />
        <span className="text-sm text-gray-700">
          All levels welcome
        </span>
      </div>
      {course.averageRating > 0 && (
        <div className="flex items-center gap-3">
          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          <span className="text-sm text-gray-700">
            {course.averageRating} average rating
          </span>
        </div>
      )}
    </div>
  </div>
</div>
          </div>
        </div>
      </section>

      {/* Related Courses */}
      {relatedCourses.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-8">
              More in {course.category?.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedCourses.map((relatedCourse, index) => (
                <Link
                  key={relatedCourse.id}
                  href={`/courses/${relatedCourse.slug}`}
                  className="group cursor-pointer bg-white rounded-2xl overflow-hidden border-2 border-gray-200 hover:border-black hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
                >
                  <div className="relative h-48 overflow-hidden">
                    {relatedCourse.thumbnail ? (
                      <Image
                        src={relatedCourse.thumbnail}
                        alt={relatedCourse.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div
                        className={`${
                          gradients[index % gradients.length]
                        } w-full h-full`}
                      />
                    )}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500"></div>
                    <div className="absolute bottom-4 right-4 bg-white rounded-full p-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <BookOpen className="w-5 h-5 text-black" />
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-gray-600 transition-colors duration-300 line-clamp-2">
                      {relatedCourse.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {relatedCourse.description}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      {relatedCourse.averageRating > 0 ? (
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">
                            {relatedCourse.averageRating}
                          </span>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-400">No reviews</div>
                      )}
                      <div className="text-sm text-gray-600">
                        {relatedCourse._count.purchases} students
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="text-2xl font-black">
                        ${relatedCourse.price}
                      </div>
                      <Button size="sm" className="rounded-full">
                        View
                      </Button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Back to Courses */}
      <section className="py-12 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-lg font-medium hover:text-gray-600 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            Back to all courses
          </Link>
        </div>
      </section>

      {/* Video Player Modal */}
      {selectedVideo && (
        <VideoPlayerModal
          isOpen={videoModalOpen}
          onClose={() => {
            setVideoModalOpen(false);
          }}
          videoUrl={selectedVideo.url}
          title={selectedVideo.title}
        />
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
