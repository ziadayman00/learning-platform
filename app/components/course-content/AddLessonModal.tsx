// components/course-content/AddLessonModal.tsx
"use client";

import { useState, useTransition } from "react";
import { createLesson } from "@/app/actions/course-content";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import VideoUpload from "./VideoUpload";

type AddLessonModalProps = {
  sectionId: string;
  isOpen: boolean;
  onClose: () => void;
};

export default function AddLessonModal({ sectionId, isOpen, onClose }: AddLessonModalProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [isFree, setIsFree] = useState(false);

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
      const result = await createLesson(sectionId, formData);

      if (result.error) {
        setError(result.error);
        toast.error(result.error);
      } else {
        toast.success("Lesson created successfully!");
        setVideoUrl("");
        setIsFree(false);
        onClose();
        // Reset form
        (e.target as HTMLFormElement).reset();
      }
    });
  };

  const handleClose = () => {
    setVideoUrl("");
    setIsFree(false);
    setError("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold">Add New Lesson</DialogTitle>
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
              onClick={handleClose}
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
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-5 w-5" />
                  Create Lesson
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}