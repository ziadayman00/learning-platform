// components/forms/DeleteCourseButton.tsx
"use client";

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { deleteCourse } from '@/app/actions/courses';
import { Trash2, Loader2, AlertTriangle, X } from 'lucide-react';

type DeleteCourseButtonProps = {
  courseId: string;
  courseName: string;
  hasStudents: boolean;
};

export default function DeleteCourseButton({ 
  courseId, 
  courseName,
  hasStudents 
}: DeleteCourseButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = () => {
    setError(null);
    
    startTransition(async () => {
      const result = await deleteCourse(courseId);
      
      if (result?.error) {
        setError(result.error);
      } else if (result?.success) {
        router.push('/dashboard?tab=teaching');
        router.refresh();
      }
    });
  };

  if (!showConfirm) {
    return (
      <Button
        variant="outline"
        onClick={() => setShowConfirm(true)}
        className="rounded-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
        disabled={isPending}
      >
        <Trash2 className="w-4 h-4 mr-2" />
        Delete Course
      </Button>
    );
  }

  return (
    <>
      {/* Modal Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={() => !isPending && setShowConfirm(false)}
      >
        {/* Modal Content */}
        <div 
          className="bg-white rounded-3xl max-w-md w-full p-8 relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={() => setShowConfirm(false)}
            disabled={isPending}
            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Warning Icon */}
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>

          {/* Title */}
          <h2 className="text-3xl font-black mb-4">
            Delete this course?
          </h2>

          {/* Description */}
          <p className="text-gray-600 mb-2">
            You're about to delete <span className="font-bold text-gray-900">"{courseName}"</span>
          </p>

          {hasStudents ? (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-yellow-800 font-medium">
                ⚠️ This course has active students. You cannot delete it. Consider unpublishing instead.
              </p>
            </div>
          ) : (
            <p className="text-gray-600 mb-6">
              This action cannot be undone. All course data will be permanently deleted.
            </p>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-800 px-4 py-3 rounded-xl mb-6">
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowConfirm(false)}
              disabled={isPending}
              className="flex-1 rounded-full h-12"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={isPending || hasStudents}
              className="flex-1 rounded-full h-12 bg-red-600 hover:bg-red-700"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Forever
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}