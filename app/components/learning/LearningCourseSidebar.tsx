// components/learning/LearningCourseSidebar.tsx
"use client";

import { useState } from "react";
import { CheckCircle, Circle, ChevronDown, ChevronUp, Play, Clock } from "lucide-react";

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

type LearningCourseSidebarProps = {
  sections: Section[];
  currentLessonId: string;
  progressMap: Record<string, { isCompleted: boolean; lastPosition: number }>;
  onLessonClick: (lesson: Lesson, sectionId: string) => void;
};

export default function LearningCourseSidebar({
  sections,
  currentLessonId,
  progressMap,
  onLessonClick,
}: LearningCourseSidebarProps) {
  // Find current section and open it by default
  const currentSection = sections.find(s => 
    s.lessons.some((l: any) => l.id === currentLessonId)
  );
  
  const [openSections, setOpenSections] = useState<string[]>(
    currentSection ? [currentSection.id] : [sections[0]?.id].filter(Boolean)
  );

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Calculate total progress
  const totalLessons = sections.reduce((sum: number, s) => sum + s.lessons.length, 0);
  const completedLessons = sections.reduce(
    (sum: number, s) => sum + s.lessons.filter((l: any) => progressMap[l.id]?.isCompleted).length,
    0
  );

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Enhanced Header */}
      <div className="p-4 sm:p-6 border-b-2 border-gray-200 bg-gradient-to-br from-gray-50 to-white">
        <h2 className="text-lg sm:text-xl font-black mb-3">Course Content</h2>
        
        {/* Progress Overview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-gray-600">Progress</span>
            <span className="font-bold">
              {completedLessons}/{totalLessons} completed
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-black transition-all duration-500"
              style={{ 
                width: `${totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0}%` 
              }}
            />
          </div>
        </div>
      </div>

      {/* Sections Content */}
      <div className="flex-1 overflow-y-auto">
        {sections.map((section: any, sectionIndex) => {
          const isOpen = openSections.includes(section.id);
          const completedInSection = section.lessons.filter(
            (l: any) => progressMap[l.id]?.isCompleted
          ).length;
          const totalInSection = section.lessons.length;
          const sectionProgress = totalInSection > 0 
            ? (completedInSection / totalInSection) * 100 
            : 0;

          return (
            <div key={section.id} className="border-b border-gray-200">
              {/* Enhanced Section Header */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full p-4 hover:bg-gray-50 transition-all duration-200 text-left group"
              >
                <div className="flex items-start gap-3">
                  {/* Section Number Badge */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    sectionProgress === 100
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                  }`}>
                    {sectionProgress === 100 ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      sectionIndex + 1
                    )}
                  </div>

                  {/* Section Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                        Section {sectionIndex + 1}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm mb-1 line-clamp-2 group-hover:text-gray-700 transition-colors">
                      {section.title}
                    </h3>
                    
                    {/* Progress Bar for Section */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-black transition-all duration-300"
                          style={{ width: `${sectionProgress}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 font-medium whitespace-nowrap">
                        {completedInSection}/{totalInSection}
                      </span>
                    </div>
                  </div>

                  {/* Chevron */}
                  <div className="flex-shrink-0">
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                    )}
                  </div>
                </div>
              </button>

              {/* Enhanced Lessons List */}
              {isOpen && (
                <div className="bg-gray-50">
                  {section.lessons.map((lesson: any, lessonIndex: any) => {
                    const isCompleted = progressMap[lesson.id]?.isCompleted || false;
                    const isCurrent = lesson.id === currentLessonId;

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => onLessonClick(lesson, section.id)}
                        className={`w-full p-3 sm:p-4 flex items-start gap-3 transition-all duration-200 text-left relative ${
                          isCurrent 
                            ? "bg-white shadow-sm" 
                            : "hover:bg-white"
                        }`}
                      >
                        {/* Active Indicator */}
                        {isCurrent && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-black" />
                        )}

                        {/* Status Icon */}
                        <div className="flex-shrink-0 mt-0.5">
                          {isCompleted ? (
                            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            </div>
                          ) : isCurrent ? (
                            <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center">
                              <Play className="w-3 h-3 text-white fill-white" />
                            </div>
                          ) : (
                            <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                              <span className="text-xs text-gray-400 font-medium">
                                {lessonIndex + 1}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Lesson Info */}
                        <div className="flex-1 min-w-0">
                          <h4
                            className={`text-sm font-semibold mb-1 line-clamp-2 ${
                              isCurrent ? "text-black" : "text-gray-700"
                            }`}
                          >
                            {lesson.title}
                          </h4>
                          
                          {/* Duration */}
                          {lesson.duration && (
                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              <span>{formatDuration(lesson.duration)}</span>
                            </div>
                          )}

                          {/* Completed Badge */}
                          {isCompleted && !isCurrent && (
                            <span className="inline-block mt-1 text-xs text-green-700 font-medium">
                              Completed
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}