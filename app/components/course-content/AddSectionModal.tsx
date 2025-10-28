// components/course-content/AddSectionModal.tsx
"use client";

import { useState, useTransition } from "react";
import { createSection } from "@/app/actions/course-content";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

type AddSectionModalProps = {
  courseId: string;
  isOpen: boolean;
  onClose: () => void;
};

export default function AddSectionModal({ courseId, isOpen, onClose }: AddSectionModalProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await createSection(courseId, formData);

      if (result.error) {
        setError(result.error);
        toast.error(result.error);
      } else {
        toast.success("Section created successfully!");
        onClose();
        // Reset form
        (e.target as HTMLFormElement).reset();
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold">Add New Section</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-lg font-semibold">
              Section Title *
            </Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g., Introduction to React"
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
              placeholder="Briefly describe what this section covers..."
              disabled={isPending}
              className="min-h-[120px] rounded-2xl border-2 border-gray-200 focus:border-black transition-colors resize-none"
            />
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
              onClick={onClose}
              disabled={isPending}
              className="flex-1 h-12 rounded-full border-2 border-gray-200 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 h-12 rounded-full bg-black text-white hover:bg-gray-800"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-5 w-5" />
                  Create Section
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}