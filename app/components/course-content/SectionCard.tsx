// components/course-content/SectionCard.tsx
"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Plus, Video, PlayCircle, Lock, Unlock } from "lucide-react";
import { deleteSection } from "@/app/actions/course-content";
import { toast } from "sonner";
import AddLessonModal from "./AddLessonModal";
import EditSectionModal from "./EditSectionModal";
import EditLessonModal from "./EditLessonModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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

type SectionCardProps = {
  section: Section;
  sectionNumber: number;
  courseId: string;
};

export default function SectionCard({ section, sectionNumber, courseId }: SectionCardProps) {
  const [showAddLesson, setShowAddLesson] = useState(false);
  const [showEditSection, setShowEditSection] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleDeleteSection = () => {
    startTransition(async () => {
      const result = await deleteSection(section.id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Section deleted successfully!");
        setShowDeleteDialog(false);
      }
    });
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "N/A";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <>
      <div className="bg-white rounded-3xl border-2 border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
        {/* Section Header */}
        <div className="bg-gray-50 border-b-2 border-gray-200 p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-black text-white rounded-full px-4 py-1 text-sm font-bold">
                  Section {sectionNumber}
                </span>
                <span className="text-gray-500 text-sm">
                  {section.lessons.length} {section.lessons.length === 1 ? "lesson" : "lessons"}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{section.title}</h3>
              {section.description && (
                <p className="text-gray-600 leading-relaxed">{section.description}</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-2 border-gray-200 hover:bg-gray-100"
                onClick={() => setShowEditSection(true)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-2 border-red-200 hover:bg-red-50 text-red-600"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Lessons List */}
        <div className="p-6 space-y-3">
          {section.lessons.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
              <Video className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600 mb-4">No lessons yet</p>
              <Button
                size="sm"
                className="rounded-full"
                onClick={() => setShowAddLesson(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add First Lesson
              </Button>
            </div>
          ) : (
            <>
              {section.lessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-200 hover:bg-gray-100 transition-colors group"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="bg-white rounded-full p-2 border-2 border-gray-200">
                      <PlayCircle className="w-5 h-5 text-gray-700" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-gray-900">{lesson.title}</p>
                        {lesson.isFree ? (
                          <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                            <Unlock className="w-3 h-3" />
                            Free Preview
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                            <Lock className="w-3 h-3" />
                            Premium
                          </span>
                        )}
                      </div>
                      {lesson.description && (
                        <p className="text-sm text-gray-600 line-clamp-1">{lesson.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500 font-medium">
                      {formatDuration(lesson.duration)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => setEditingLesson(lesson)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {/* Add Lesson Button */}
              <Button
                variant="outline"
                className="w-full h-12 rounded-2xl border-2 border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                onClick={() => setShowAddLesson(true)}
              >
                <Plus className="mr-2 h-5 w-5" />
                Add Lesson
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      <AddLessonModal
        sectionId={section.id}
        isOpen={showAddLesson}
        onClose={() => setShowAddLesson(false)}
      />

      <EditSectionModal
        section={section}
        isOpen={showEditSection}
        onClose={() => setShowEditSection(false)}
      />

      {editingLesson && (
        <EditLessonModal
          lesson={editingLesson}
          isOpen={!!editingLesson}
          onClose={() => setEditingLesson(null)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold">Delete Section?</AlertDialogTitle>
            <AlertDialogDescription className="text-base text-gray-600">
              This will permanently delete <strong>{section.title}</strong> and all its lessons ({section.lessons.length}). This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full border-2 border-gray-200">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSection}
              disabled={isPending}
              className="rounded-full bg-red-600 hover:bg-red-700"
            >
              {isPending ? "Deleting..." : "Delete Section"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}