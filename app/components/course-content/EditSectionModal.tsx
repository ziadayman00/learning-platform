// components/course-content/EditSectionModal.tsx
"use client";

import { useState, useTransition } from "react";
import { updateSection } from "@/app/actions/course-content";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

type Section = {
  id: string;
  title: string;
  description: string | null;
  position: number;
};

type EditSectionModalProps = {
  section: Section;
  isOpen: boolean;
  onClose: () => void;
};

export default function EditSectionModal({ section, isOpen, onClose }: EditSectionModalProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await updateSection(section.id, formData);

      if (result.error) {
        setError(result.error);
        toast.error(result.error);
      } else {
        toast.success("Section updated successfully!");
        onClose();
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold">Edit Section</DialogTitle>
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
              defaultValue={section.title}
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
              defaultValue={section.description || ""}
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
        </form>
      </DialogContent>
    </Dialog>
  );
}