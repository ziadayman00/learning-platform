"use client";

import { useState, useTransition, useEffect } from "react";
import { createLesson } from "@/app/actions/course-content";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Plus, AlertCircle, Clock, FileVideo, CheckCircle2 } from "lucide-react";
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
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showValidation, setShowValidation] = useState(false);

  // Calculate total duration
  const totalDuration = (parseInt(minutes) || 0) * 60 + (parseInt(seconds) || 0);
  const formattedDuration = totalDuration > 0 
    ? `${Math.floor(totalDuration / 60)}:${(totalDuration % 60).toString().padStart(2, '0')}`
    : "Not set";

  // Validation states
  const isVideoValid = !!videoUrl;
  const isTitleValid = title.trim().length >= 3;
  const isDurationValid = totalDuration > 0 || true; // Duration is optional
  const isFormValid = isVideoValid && isTitleValid;

  // Character counts
  const titleCharCount = title.length;
  const descriptionCharCount = description.length;
  const titleMaxChars = 100;
  const descriptionMaxChars = 500;

  // Auto-adjust seconds if over 59
  useEffect(() => {
    const sec = parseInt(seconds) || 0;
    if (sec >= 60) {
      const additionalMinutes = Math.floor(sec / 60);
      const remainingSeconds = sec % 60;
      setMinutes((prev) => (parseInt(prev) || 0) + additionalMinutes + "");
      setSeconds(remainingSeconds.toString());
    }
  }, [seconds]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        resetForm();
      }, 300);
    }
  }, [isOpen]);

  const resetForm = () => {
    setVideoUrl("");
    setIsFree(false);
    setMinutes("");
    setSeconds("");
    setTitle("");
    setDescription("");
    setError("");
    setShowValidation(false);
  };

  const handleSubmit = async () => {
    setShowValidation(true);

    if (!isFormValid) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    setError("");

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("videoUrl", videoUrl);
    formData.append("isFree", isFree.toString());
    
    if (totalDuration > 0) {
      formData.append("duration", totalDuration.toString());
    }

    startTransition(async () => {
      const result = await createLesson(sectionId, formData);

      if (result.error) {
        setError(result.error);
        toast.error(result.error);
      } else {
        toast.success("Lesson created successfully!");
        onClose();
      }
    });
  };

  const handleClose = () => {
    if (isPending) return;
    
    const hasContent = videoUrl || title || description || minutes || seconds;
    
    if (hasContent) {
      const confirmClose = window.confirm(
        "You have unsaved changes. Are you sure you want to close?"
      );
      if (!confirmClose) return;
    }
    
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[750px] max-h-[90vh] overflow-y-auto rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold flex items-center gap-2">
            <FileVideo className="h-8 w-8" />
            Add New Lesson
          </DialogTitle>
          <p className="text-sm text-gray-600 mt-2">
            Create a new lesson for your course section
          </p>
        </DialogHeader>

        <div className="space-y-6 mt-4" onKeyDown={handleKeyDown}>
          {/* Video Upload */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold flex items-center gap-2">
                Video *
                {isVideoValid && <CheckCircle2 className="h-4 w-4 text-green-600" />}
              </Label>
              {showValidation && !isVideoValid && (
                <span className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  Required
                </span>
              )}
            </div>
            <VideoUpload
              value={videoUrl}
              onChange={setVideoUrl}
              onRemove={() => setVideoUrl("")}
            />
            <p className="text-xs text-gray-500">
              Supported formats: MP4, WebM, MOV (max 500MB recommended)
            </p>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="title" className="text-lg font-semibold flex items-center gap-2">
                Lesson Title *
                {isTitleValid && <CheckCircle2 className="h-4 w-4 text-green-600" />}
              </Label>
              <span className={`text-xs ${titleCharCount > titleMaxChars ? 'text-red-600' : 'text-gray-500'}`}>
                {titleCharCount}/{titleMaxChars}
              </span>
            </div>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Introduction to Components"
              disabled={isPending}
              maxLength={titleMaxChars}
              className={`h-12 rounded-2xl border-2 transition-colors ${
                showValidation && !isTitleValid
                  ? 'border-red-300 focus:border-red-500'
                  : 'border-gray-200 focus:border-black'
              }`}
            />
            {showValidation && !isTitleValid && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Title must be at least 3 characters
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="description" className="text-lg font-semibold">
                Description (Optional)
              </Label>
              <span className={`text-xs ${descriptionCharCount > descriptionMaxChars ? 'text-red-600' : 'text-gray-500'}`}>
                {descriptionCharCount}/{descriptionMaxChars}
              </span>
            </div>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What will students learn in this lesson? Include key topics and learning outcomes..."
              disabled={isPending}
              maxLength={descriptionMaxChars}
              className="min-h-[100px] rounded-2xl border-2 border-gray-200 focus:border-black transition-colors resize-none"
            />
            <p className="text-xs text-gray-500">
              A clear description helps students understand what to expect
            </p>
          </div>

          {/* Duration */}
          <div className="space-y-3">
            <Label className="text-lg font-semibold flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Duration
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Input
                  id="minutes"
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value.replace(/\D/g, ''))}
                  type="number"
                  min="0"
                  placeholder="0"
                  disabled={isPending}
                  className="h-12 rounded-2xl border-2 border-gray-200 focus:border-black transition-colors text-center text-lg font-semibold"
                />
                <p className="text-sm text-gray-600 text-center font-medium">Minutes</p>
              </div>
              <div className="space-y-2">
                <Input
                  id="seconds"
                  value={seconds}
                  onChange={(e) => setSeconds(e.target.value.replace(/\D/g, ''))}
                  type="number"
                  min="0"
                  max="59"
                  placeholder="0"
                  disabled={isPending}
                  className="h-12 rounded-2xl border-2 border-gray-200 focus:border-black transition-colors text-center text-lg font-semibold"
                />
                <p className="text-sm text-gray-600 text-center font-medium">Seconds</p>
              </div>
            </div>
            {totalDuration > 0 && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-3 flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-semibold text-blue-900">Total Duration</p>
                  <p className="text-lg font-bold text-blue-700">{formattedDuration}</p>
                </div>
              </div>
            )}
            <p className="text-sm text-gray-500">
              Leave empty if duration is unknown - it can be added later
            </p>
          </div>

          {/* Free Preview Toggle */}
          <div className={`flex items-start space-x-3 rounded-2xl p-4 border-2 transition-all ${
            isFree 
              ? 'bg-green-50 border-green-300' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <Checkbox
              id="isFree"
              checked={isFree}
              onCheckedChange={(checked) => setIsFree(checked as boolean)}
              disabled={isPending}
              className="rounded-md mt-1"
            />
            <div className="flex-1">
              <Label
                htmlFor="isFree"
                className="text-base font-semibold cursor-pointer flex items-center gap-2"
              >
                Make this lesson free to preview
                {isFree && <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">Free</span>}
              </Label>
              <p className="text-sm text-gray-600 mt-1">
                Free lessons can be watched by anyone without purchasing the course. Great for attracting students!
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-800 rounded-2xl p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">Error</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Progress Indicator */}
          <div className="bg-gray-50 rounded-2xl p-4 border-2 border-gray-200">
            <p className="text-sm font-semibold text-gray-700 mb-3">Progress</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                {isVideoValid ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                )}
                <span className={isVideoValid ? 'text-green-700 font-medium' : 'text-gray-600'}>
                  Video uploaded
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {isTitleValid ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                )}
                <span className={isTitleValid ? 'text-green-700 font-medium' : 'text-gray-600'}>
                  Title added
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {description ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                )}
                <span className={description ? 'text-green-700 font-medium' : 'text-gray-500'}>
                  Description added (optional)
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isPending}
              className="flex-1 h-12 rounded-full border-2 border-gray-200 hover:bg-gray-50 font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isPending || !isFormValid}
              className="flex-1 h-12 rounded-full bg-black text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
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
          
          <p className="text-xs text-center text-gray-500">
            Press Cmd/Ctrl + Enter to submit
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}