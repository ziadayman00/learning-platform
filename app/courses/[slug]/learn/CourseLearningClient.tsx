// app/courses/[slug]/learn/CourseLearningClient.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Award,
  Clock,
} from "lucide-react";
import {
  markLessonComplete,
  updateLessonProgress,
} from "@/app/actions/progress";
import { toast } from "sonner";
import LearningCourseSidebar from "@/app/components/learning/LearningCourseSidebar";
import ReviewModal from "@/app/components/learning/ReviewModal";
import { MessageSquare } from "lucide-react";

type Lesson = {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string;
  duration: number | null;
  position: number;
  isFree: boolean;
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
  instructor: {
    id: string;
    name: string;
    image: string | null;
  };
  sections: Section[];
};

type CourseLearningClientProps = {
  course: Course;
  currentLesson: Lesson;
  currentSectionId: string;
  progressMap: Record<string, { isCompleted: boolean; lastPosition: number }>;
  showEnrollSuccess?: boolean;
  userReview?: {
    rating: number;
    comment: string | null;
  } | null;
};

export default function CourseLearningClient({
  course,
  currentLesson: initialLesson,
  currentSectionId: initialSectionId,
  progressMap: initialProgressMap,
  showEnrollSuccess: showEnrollSuccess,
}: CourseLearningClientProps) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentLesson, setCurrentLesson] = useState(initialLesson);
  // ADD THIS ENTIRE useEffect
  useEffect(() => {
    if (showEnrollSuccess) {
      toast.success("🎉 Welcome! You're now enrolled in this course!");
      // Clean up the URL
      router.replace(
        `/courses/${course.slug}/learn?lesson=${currentLesson.id}`
      );
    }
  }, [showEnrollSuccess, router, course.slug, currentLesson.id]);
  const [currentSectionId, setCurrentSectionId] = useState(initialSectionId);
  const [progressMap, setProgressMap] = useState(initialProgressMap);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [userReview, setUserReview] = useState<{
    rating: number;
    comment: string | null;
  } | null>(null);

  const currentProgress = progressMap[currentLesson.id];
  const isCompleted = currentProgress?.isCompleted || false;
  const savedPosition = currentProgress?.lastPosition || 0;

  // Calculate progress
  const totalLessons = course.sections.reduce(
    (sum: number, s) => sum + s.lessons.length,
    0
  );
  const completedLessons = Object.values(progressMap).filter(
    (p) => p.isCompleted
  ).length;
  const overallProgress =
    totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  // Find next and previous lessons
  const allLessons: { lesson: Lesson; sectionId: string }[] = [];
  course.sections.forEach((section: any) => {
    section.lessons.forEach((lesson: any) => {
      allLessons.push({ lesson, sectionId: section.id });
    });
  });

  const currentIndex = allLessons.findIndex(
    (l) => l.lesson.id === currentLesson.id
  );
  const nextLesson =
    currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;

  // Format duration
  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "N/A";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Video handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setPlayedSeconds(video.currentTime);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
    };
  }, [currentLesson.id]);

  useEffect(() => {
    const video = videoRef.current;
    if (video && savedPosition > 0) {
      video.currentTime = savedPosition;
    }
  }, [currentLesson.id, savedPosition]);

  // Save progress periodically
  useEffect(() => {
    if (isPlaying && playedSeconds > 0) {
      const interval = setInterval(() => {
        updateLessonProgress(currentLesson.id, playedSeconds);
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, playedSeconds, currentLesson.id]);

  const handleLessonChange = (lesson: Lesson, sectionId: string) => {
    setCurrentLesson(lesson);
    setCurrentSectionId(sectionId);
    setIsPlaying(false);
    setPlayedSeconds(0);
    router.push(`/courses/${course.slug}/learn?lesson=${lesson.id}`, {
      scroll: false,
    });
  };

  const handleMarkComplete = async () => {
    setIsCompleting(true);
    const result = await markLessonComplete(currentLesson.id);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Lesson completed! 🎉");
      setProgressMap((prev) => ({
        ...prev,
        [currentLesson.id]: { ...prev[currentLesson.id], isCompleted: true },
      }));

      if (nextLesson) {
        setTimeout(() => {
          handleLessonChange(nextLesson.lesson, nextLesson.sectionId);
        }, 1500);
      }
    }
    setIsCompleting(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Enhanced Top Header */}
      {/* Enhanced Top Header - Hidden on mobile when sidebar is open */}
      <header
        className={`bg-white border-b-2 border-gray-200 px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-30 shadow-sm transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "-translate-y-full lg:translate-y-0" : "translate-y-0"
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          {/* Left Section */}
          <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden rounded-full flex-shrink-0 hover:bg-gray-100"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>

            <Link
              href={`/courses/${course.slug}`}
              className="flex items-center gap-2 hover:text-gray-600 transition-colors min-w-0 flex-1"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="font-bold text-sm sm:text-lg truncate">
                {course.title}
              </span>
            </Link>
          </div>

          {/* Progress Section */}
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            <div className="hidden sm:flex items-center gap-3">
              <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                {completedLessons}/{totalLessons}
              </span>
              <div className="w-20 sm:w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-black transition-all duration-500"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
              <span className="text-xs sm:text-sm font-bold whitespace-nowrap">
                {Math.round(overallProgress)}%
              </span>
            </div>

            {/* Mobile Progress */}
            <div className="sm:hidden flex items-center gap-2">
              <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-black transition-all duration-500"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
              <span className="text-xs font-bold">
                {Math.round(overallProgress)}%
              </span>
            </div>
          </div>
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        {/* Enhanced Sidebar */}
        <div
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 fixed lg:relative left-0 z-20 w-80 xl:w-96 bg-white border-r-2 border-gray-200 transition-transform duration-300 ease-in-out flex flex-col shadow-lg lg:shadow-none top-[73px] lg:top-0 bottom-0`}
        >
          <LearningCourseSidebar
            sections={course.sections}
            currentLessonId={currentLesson.id}
            progressMap={progressMap}
            onLessonClick={handleLessonChange}
          />
        </div>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed bg-black/60 z-10 backdrop-blur-sm top-[73px] left-0 right-0 bottom-0"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Enhanced Main Content */}
        <main className="flex-1 overflow-y-auto bg-white">
          {/* Video Player */}
          <div className="bg-black w-full" style={{ aspectRatio: "16/9" }}>
            <video
              ref={videoRef}
              src={currentLesson.videoUrl}
              controls
              controlsList="nodownload"
              className="w-full h-full"
              onError={(e) => {
                console.error("Video error:", e);
                toast.error("Failed to load video");
              }}
            >
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Lesson Content */}
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {/* Lesson Header */}
            <div className="mb-6 sm:mb-8">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight flex-1">
                  {currentLesson.title}
                </h1>
                {currentLesson.duration && (
                  <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full flex-shrink-0">
                    <Clock className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      {formatDuration(currentLesson.duration)}
                    </span>
                  </div>
                )}
              </div>

              {/* Review Section */}
              <div className="mb-6 sm:mb-8">
                <Button
                  onClick={() => setShowReviewModal(true)}
                  variant="outline"
                  className="rounded-full border-2 hover:bg-gray-100"
                >
                  <MessageSquare className="mr-2 h-5 w-5" />
                  {userReview ? "Edit Your Review" : "Rate This Course"}
                </Button>
              </div>

              {currentLesson.description && (
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                  {currentLesson.description}
                </p>
              )}
            </div>

            {/* Enhanced Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-8 pb-6 sm:pb-8 border-b-2 border-gray-200">
              <Button
                onClick={handleMarkComplete}
                disabled={isCompleted || isCompleting}
                className={`rounded-full h-11 sm:h-12 px-6 font-semibold transition-all duration-300 ${
                  isCompleted
                    ? "bg-green-600 hover:bg-green-700 shadow-lg"
                    : "bg-black hover:bg-gray-800"
                }`}
              >
                {isCompleted ? (
                  <>
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Completed
                  </>
                ) : isCompleting ? (
                  "Marking complete..."
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Mark as Complete
                  </>
                )}
              </Button>

              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  onClick={() =>
                    prevLesson &&
                    handleLessonChange(prevLesson.lesson, prevLesson.sectionId)
                  }
                  disabled={!prevLesson}
                  className="rounded-full border-2 hover:bg-gray-100 flex-1 sm:flex-initial"
                >
                  <ChevronLeft className="mr-1 sm:mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Previous</span>
                  <span className="sm:hidden">Prev</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    nextLesson &&
                    handleLessonChange(nextLesson.lesson, nextLesson.sectionId)
                  }
                  disabled={!nextLesson}
                  className="rounded-full border-2 hover:bg-gray-100 flex-1 sm:flex-initial"
                >
                  <span className="hidden sm:inline">Next</span>
                  <span className="sm:hidden">Next</span>
                  <ChevronRight className="ml-1 sm:ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {/* Progress Card */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border-2 border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-black text-white rounded-full p-2">
                    <Award className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-lg">Your Progress</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Lessons completed</span>
                    <span className="font-semibold">
                      {completedLessons}/{totalLessons}
                    </span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-black transition-all duration-500"
                      style={{ width: `${overallProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Keep going! You're {Math.round(overallProgress)}% through
                    the course.
                  </p>
                </div>
              </div>

              {/* Instructor Card */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border-2 border-gray-200">
                <h3 className="font-bold text-lg mb-4">About the Instructor</h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center flex-shrink-0 border-2 border-white shadow-md">
                    {course.instructor.image ? (
                      <img
                        src={course.instructor.image}
                        alt={course.instructor.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-xl font-black text-white">
                        {course.instructor.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {course.instructor.name}
                    </p>
                    <p className="text-sm text-gray-600">Course Instructor</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Completion Badge */}
            {overallProgress === 100 && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 text-center">
                <Award className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-2xl font-black text-gray-900 mb-2">
                  Course Completed! 🎉
                </h3>
                <p className="text-gray-700 mb-4">
                  Congratulations on completing this course!
                </p>
                <Button className="rounded-full" asChild>
                  <Link href={`/courses/${course.slug}/certificate`}>
                    View Certificate
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>{" "}
      {/* Review Modal */}
      {showReviewModal && (
        <ReviewModal
          courseId={course.id}
          courseTitle={course.title}
          existingReview={userReview}
          onClose={() => setShowReviewModal(false)}
          onSuccess={() => {
            // Optionally refresh to get updated review
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
