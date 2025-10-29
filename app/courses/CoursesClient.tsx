// app/courses/CoursesClient.tsx (Client Component)
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Filter,
  BookOpen,
  Star,
  User,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";

type Course = {
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
    slug: string;
  } | null;
  _count: {
    purchases: number;
    reviews: number;
  };
  averageRating: number;
};

type Category = {
  name: string;
  slug: string;
};

type CoursesClientProps = {
  courses: Course[];
  categories: Category[];
};

export default function CoursesClient({ courses, categories }: CoursesClientProps) {
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFiltering, setIsFiltering] = useState(false);

  // Sync search query from URL params with loading state
  useEffect(() => {
    const newSearch = searchParams.get("search") || "";
    if (newSearch !== searchQuery) {
      setIsFiltering(true);
      setSearchQuery(newSearch);

      // Small delay to show the loading state
      const timer = setTimeout(() => {
        setIsFiltering(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [searchParams, searchQuery]);

  // Filter courses based on category and search
  const filteredCourses = courses.filter((course) => {
    const matchesCategory =
      selectedCategory === "All" || course.category?.name === selectedCategory;

    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Generate gradient colors for thumbnails (fallback if no image)
  const gradients = [
    "bg-gradient-to-br from-blue-500 to-purple-600",
    "bg-gradient-to-br from-pink-500 to-orange-500",
    "bg-gradient-to-br from-gray-800 to-gray-600",
    "bg-gradient-to-br from-green-500 to-teal-600",
    "bg-gradient-to-br from-red-500 to-pink-600",
    "bg-gradient-to-br from-indigo-500 to-blue-600",
  ];

  const categoryOptions = ["All", ...categories.map((cat) => cat.name)];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Category Filter */}
      <section className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
            {categoryOptions.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-black text-white shadow-lg scale-105"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-16 bg-white flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold">
                {filteredCourses.length}{" "}
                {filteredCourses.length === 1 ? "Course" : "Courses"}
              </h2>
              {isFiltering && (
                <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
              )}
            </div>
            <div className="text-sm text-gray-500">
              Showing{" "}
              {selectedCategory === "All" ? "all categories" : selectedCategory}
            </div>
          </div>

          {/* Loading overlay */}
          <div
            className={`transition-opacity duration-300 ${
              isFiltering ? "opacity-50" : "opacity-100"
            }`}
          >
            {filteredCourses.length === 0 ? (
              <div className="text-center py-20">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  No courses found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your filters or search query
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCourses.map((course, index) => (
                  <Link
                    key={course.id}
                    href={`/courses/${course.slug}`}
                    className="group cursor-pointer bg-white rounded-2xl overflow-hidden border-2 border-gray-200 hover:border-black hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
                  >
                    {/* Thumbnail */}
                    <div className="relative h-48 overflow-hidden">
                      {course.thumbnail ? (
                        <Image
                          src={course.thumbnail}
                          alt={course.title}
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
                      {course.category && (
                        <div className="absolute top-4 left-4">
                          <span className="bg-white px-4 py-1 rounded-full text-sm font-medium shadow-lg">
                            {course.category.name}
                          </span>
                        </div>
                      )}
                      <div className="absolute bottom-4 right-4 bg-white rounded-full p-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <BookOpen className="w-5 h-5 text-black" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-2xl font-bold mb-2 group-hover:text-gray-600 transition-colors duration-300 line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {course.description}
                      </p>

                      {/* Instructor */}
                      <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                        {course.instructor.image ? (
                          <div className="relative w-5 h-5 rounded-full overflow-hidden">
                            <Image
                              src={course.instructor.image}
                              alt={course.instructor.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <User className="w-4 h-4" />
                        )}
                        <span>{course.instructor.name}</span>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                        {course.averageRating > 0 ? (
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">
                              {course.averageRating}
                            </span>
                            <span className="text-gray-400">
                              ({course._count.reviews})
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-gray-400">
                            <Star className="w-4 h-4" />
                            <span>No reviews yet</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{course._count.purchases} students</span>
                        </div>
                      </div>

                      {/* Price and CTA */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="text-3xl font-black">
                          ${course.price}
                        </div>
                        <Button className="rounded-full font-medium group/btn">
                          Enroll
                          <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                        </Button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Can't find what you're looking for?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            We're constantly adding new courses. Check back soon or become an
            instructor yourself.
          </p>
          <Button
            size="lg"
            variant="outline"
            className="border-white hover:bg-white text-black rounded-full"
            asChild
          >
            <Link href="/become-instructor">
              Become an Instructor
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
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