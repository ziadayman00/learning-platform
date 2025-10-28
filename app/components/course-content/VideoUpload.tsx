// components/course-content/VideoUpload.tsx
"use client";

import { Video, Upload, X } from "lucide-react";
import { useState } from "react";

// Import from your lib file
import { UploadDropzone } from "@/lib/uploadthing";

type VideoUploadProps = {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
};

export default function VideoUpload({ value, onChange, onRemove }: VideoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  if (value) {
    return (
      <div className="relative bg-gray-50 rounded-3xl border-2 border-gray-200 p-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-black text-white rounded-full p-3">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-lg">Video Uploaded</p>
              <p className="text-sm text-gray-600">Ready to use</p>
            </div>
          </div>
          {onRemove && (
            <button
              onClick={onRemove}
              className="text-gray-400 hover:text-red-600 transition-colors"
              type="button"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>
        <video
          src={value}
          controls
          className="w-full rounded-2xl border border-gray-200"
        />
      </div>
    );
  }

  return (
    <div className="relative bg-white rounded-3xl border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors p-8">
      <div className="text-center mb-6">
        <div className="bg-gray-100 rounded-full p-6 mb-4 mx-auto w-fit">
          <Upload className="w-12 h-12 text-gray-600" />
        </div>
        <p className="text-xl font-bold text-gray-900 mb-2">
          {isUploading ? "Uploading video..." : "Upload course video"}
        </p>
        <p className="text-sm text-gray-600">
          Drag and drop or click to browse
        </p>
      </div>

      <UploadDropzone
        endpoint="courseVideo"
        onClientUploadComplete={(res) => {
          if (res?.[0]?.url) {
            onChange(res[0].url);
            setIsUploading(false);
          }
        }}
        onUploadError={(error: Error) => {
          console.error("Upload error:", error);
          alert(`Upload failed: ${error.message}`);
          setIsUploading(false);
        }}
        onUploadBegin={() => {
          setIsUploading(true);
        }}
        config={{
          mode: "auto",
        }}
      />

      <p className="text-xs text-gray-500 text-center mt-4">
        MP4, MOV, AVI up to 512MB
      </p>
    </div>
  );
}