// components/forms/CourseForm.tsx
"use client";

import { useState, useTransition, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { createCourse, updateCourse } from '@/app/actions/courses';
import { Loader2, Save, Eye } from 'lucide-react';
import ImageUpload from '../course-content/ImageUpload';

type Category = {
  id: string;
  name: string;
  slug: string;
};

type Course = {
  id: string;
  title: string;
  description: string;
  price: number;
  thumbnail: string | null;
  isPublished: boolean;
  categoryId: string | null;
};

type CourseFormProps = {
  categories: Category[];
  mode: 'create' | 'edit';
  course?: Course;
};

export default function CourseForm({ categories, mode, course }: CourseFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [thumbnail, setThumbnail] = useState<string | null>(course?.thumbnail || null);

  const handleAction = async (shouldPublish: boolean) => {
    if (!formRef.current) return;
    
    setError(null);
    setSuccess(null);

    const formData = new FormData(formRef.current);
    formData.set('isPublished', shouldPublish.toString());
    if (thumbnail) {
      formData.set('thumbnail', thumbnail);
    }

    startTransition(async () => {
      let result;
      
      if (mode === 'create') {
        result = await createCourse(formData);
      } else if (course) {
        result = await updateCourse(course.id, formData);
      }

      if (result?.error) {
        setError(result.error);
      } else if (result?.success) {
        setSuccess(mode === 'create' ? 'Course created successfully!' : 'Course updated successfully!');
        
        // Redirect after a short delay
        setTimeout(() => {
          router.push('/dashboard');
          router.refresh();
        }, 1000);
      }
    });
  };

  return (
    <form ref={formRef} onSubmit={(e) => e.preventDefault()} className="bg-white rounded-3xl border-2 border-gray-200 p-8 md:p-12">
      <div className="space-y-8">
        {/* Title */}
        <div>
          <Label htmlFor="title">Course Title *</Label>
          <Input
            id="title"
            name="title"
            placeholder="e.g., Complete Web Development Bootcamp"
            defaultValue={course?.title}
            required
            disabled={isPending}
          />
          <p className="text-sm text-gray-500 mt-2">
            Choose a clear, descriptive title that tells students what they'll learn
          </p>
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Describe what students will learn in this course..."
            defaultValue={course?.description}
            required
            disabled={isPending}
            rows={6}
          />
          <p className="text-sm text-gray-500 mt-2">
            Explain the key topics, skills, and outcomes students can expect
          </p>
        </div>

        {/* Price and Category Row */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Price */}
          <div>
            <Label htmlFor="price">Price (USD) *</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              placeholder="49.99"
              defaultValue={course?.price}
              required
              disabled={isPending}
            />
            <p className="text-sm text-gray-500 mt-2">
              Set a competitive price for your course
            </p>
          </div>

          {/* Category */}
          <div>
            <Label htmlFor="categoryId">Category *</Label>
            <Select
              id="categoryId"
              name="categoryId"
              defaultValue={course?.categoryId || ''}
              required
              disabled={isPending}
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
            <p className="text-sm text-gray-500 mt-2">
              Help students find your course
            </p>
          </div>
        </div>

        {/* Thumbnail Upload */}
        <div>
          <Label className="mb-2 block">Course Thumbnail</Label>
          <ImageUpload
            value={thumbnail}
            onChange={(url) => setThumbnail(url)}
            onRemove={() => setThumbnail(null)}
            disabled={isPending}
          />
          <input 
            type="hidden" 
            name="thumbnail" 
            value={thumbnail || ''} 
          />
          <p className="text-sm text-gray-500 mt-2">
            Upload a high-quality image to attract students (16:9 ratio recommended)
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border-2 border-green-200 text-green-800 px-6 py-4 rounded-xl">
            <p className="font-medium">✓ {success}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-800 px-6 py-4 rounded-xl">
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t-2 border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isPending}
            className="flex-1 rounded-full h-12"
          >
            Cancel
          </Button>
          
          <Button
            type="button"
            onClick={() => handleAction(false)}
            disabled={isPending}
            variant="outline"
            className="flex-1 rounded-full h-12"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save as Draft
              </>
            )}
          </Button>

          <Button
            type="button"
            onClick={() => handleAction(true)}
            disabled={isPending}
            className="flex-1 rounded-full h-12"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" />
                {mode === 'create' ? 'Publish Course' : 'Save & Publish'}
              </>
            )}
          </Button>
        </div>

        {/* Publishing Info */}
        <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <Eye className="w-5 h-5 text-gray-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold mb-1">
                Publishing Options
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Save as Draft:</strong> Work on your course privately. Only you can see it.
              </p>
              <p className="text-sm text-gray-600">
                <strong>Publish Course:</strong> Make your course live and visible to all students.
              </p>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}