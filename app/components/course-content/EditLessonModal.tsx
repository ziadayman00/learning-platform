// components/course-content/EditLessonModal.tsx
"use client";

import { useState, useTransition } from "react";
import { updateLesson, deleteLesson } from "@/app/actions/course-content";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import VideoUpload from "./VideoUpload";
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

type EditLessonModalProps = {
  lesson: Lesson;
  isOpen: boolean;
  onClose: () => void;
};

export default function EditLessonModal({ lesson, isOpen, onClose }: EditLessonModalProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [videoUrl, setVideoUrl] = useState(lesson.videoUrl);
  const [isFree, setIsFree] = useState(lesson.isFree);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!videoUrl) {
      setError("Please upload a video");
      toast.error("Please upload a video");
      return;
    }

    const formData = new FormData(e.currentTarget);
    formData.append("videoUrl", videoUrl);
    formData.append("isFree", isFree.toString());

    startTransition(async () => {
      const result = await updateLesson(lesson.id, formData);

      if (result.error) {
        setError(result.error);
        toast.error(result.error);
      } else {
        toast.success("Lesson updated successfully!");
        onClose();
      }
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteLesson(lesson.id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Lesson deleted successfully!");
        setShowDeleteDialog(false);
        onClose();
      }
    });
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold">Edit Lesson</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            {/* Video Upload */}
            <div className="space-y-2">
              <Label className="text-lg font-semibold">Video *</Label>
              <VideoUpload
                value={videoUrl}
                onChange={setVideoUrl}
                onRemove={() => setVideoUrl("")}
              />
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-lg font-semibold">
                Lesson Title *
              </Label>
              <Input
                id="title"
                name="title"
                defaultValue={lesson.title}
                placeholder="e.g., Introduction to Components"
                required
                disabled={isPending}
                className="h-12 rounded-2xl border-2 border-gray-200 focus:border-black transition-colors"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-lg font-semibold">
                Description (Optional)
              </Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={lesson.description || ""}
                placeholder="What will students learn in this lesson?"
                disabled={isPending}
                className="min-h-[100px] rounded-2xl border-2 border-gray-200 focus:border-black transition-colors resize-none"
              />
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label htmlFor="duration" className="text-lg font-semibold">
                Duration (seconds)
              </Label>
              <Input
                id="duration"
                name="duration"
                type="number"
                defaultValue={lesson.duration || ""}
                placeholder="e.g., 300 (for 5 minutes)"
                disabled={isPending}
                className="h-12 rounded-2xl border-2 border-gray-200 focus:border-black transition-colors"
              />
              <p className="text-sm text-gray-500">Enter duration in seconds (e.g., 300 = 5 minutes)</p>
            </div>

            {/* Free Preview Checkbox */}
            <div className="flex items-center space-x-3 bg-gray-50 rounded-2xl p-4 border-2 border-gray-200">
              <Checkbox
                id="isFree"
                checked={isFree}
                onCheckedChange={(checked) => setIsFree(checked as boolean)}
                disabled={isPending}
                className="rounded-md"
              />
              <div className="flex-1">
                <Label
                  htmlFor="isFree"
                  className="text-base font-semibold cursor-pointer"
                >
                  Make this lesson free to preview
                </Label>
                <p className="text-sm text-gray-600 mt-1">
                  Free lessons can be watched by anyone without purchasing the course
                </p>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-800 rounded-2xl p-4">
                <p className="font-medium">{error}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDeleteDialog(true)}
                disabled={isPending}
                className="h-12 rounded-full border-2 border-red-200 hover:bg-red-50 text-red-600"
              >
                <Trash2 className="mr-2 h-5 w-5" />
                Delete
              </Button>
              <div className="flex-1 flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isPending}
                  className="flex-1 h-12 rounded-full border-2 border-gray-200 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isPending || !videoUrl}
                  className="flex-1 h-12 rounded-full bg-black text-white hover:bg-gray-800 disabled:opacity-50"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-5 w-5" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold">Delete Lesson?</AlertDialogTitle>
            <AlertDialogDescription className="text-base text-gray-600">
              This will permanently delete <strong>{lesson.title}</strong>. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full border-2 border-gray-200">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending}
              className="rounded-full bg-red-600 hover:bg-red-700"
            >
              {isPending ? "Deleting..." : "Delete Lesson"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}