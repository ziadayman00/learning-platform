// app/instructor/courses/[id]/content/CourseContentClient.tsx
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, BookOpen } from 'lucide-react';
import AddSectionModal from '@/app/components/course-content/AddSectionModal';
import SectionCard from '@/app/components/course-content/SectionCard';

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
  sections: Section[];
};

type CourseContentClientProps = {
  course: Course;
};

export default function CourseContentClient({ course }: CourseContentClientProps) {
  const [showAddSection, setShowAddSection] = useState(false);

  return (
    <div className="space-y-8">
      {/* Header with Add Section Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Course Curriculum</h2>
          <p className="text-gray-600 mt-2">
            {course.sections.length} {course.sections.length === 1 ? 'section' : 'sections'} • {' '}
            {course.sections.reduce((total: number, section) => total + section.lessons.length, 0)} lessons
          </p>
        </div>
        <Button
          size="lg"
          className="rounded-full"
          onClick={() => setShowAddSection(true)}
        >
          <Plus className="mr-2 h-5 w-5" />
          Add Section
        </Button>
      </div>

      {/* Sections List */}
      {course.sections.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-gray-200">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No sections yet</h3>
          <p className="text-gray-600 mb-6">
            Start building your course by adding sections and lessons
          </p>
          <Button
            size="lg"
            className="rounded-full"
            onClick={() => setShowAddSection(true)}
          >
            <Plus className="mr-2 h-5 w-5" />
            Add Your First Section
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {course.sections.map((section: any, index) => (
            <SectionCard
              key={section.id}
              section={section}
              sectionNumber={index + 1}
              courseId={course.id}
            />
          ))}
        </div>
      )}

      {/* Add Section Modal */}
      <AddSectionModal
        courseId={course.id}
        isOpen={showAddSection}
        onClose={() => setShowAddSection(false)}
      />
    </div>
  );
}