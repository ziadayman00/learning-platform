"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import { X, Image as ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

type ImageUploadProps = {
  value?: string | null;
  onChange: (url: string) => void;
  onRemove: () => void;
  disabled?: boolean;
};

export default function ImageUpload({
  value,
  onChange,
  onRemove,
  disabled,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  if (value) {
    return (
      <div className="relative aspect-video w-full max-w-xl bg-gray-100 rounded-xl overflow-hidden border-2 border-gray-200">
        <div className="absolute top-2 right-2 z-10">
          <button
            type="button"
            onClick={onRemove}
            disabled={disabled}
            className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full transition-colors shadow-sm"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <Image
          src={value}
          alt="Course thumbnail"
          fill
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl">
      <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors p-6">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="bg-gray-100 p-4 rounded-full mb-4">
            {isUploading ? (
              <Loader2 className="w-8 h-8 text-gray-500 animate-spin" />
            ) : (
              <ImageIcon className="w-8 h-8 text-gray-500" />
            )}
          </div>
          <div className="mb-2 text-sm font-semibold">
            {isUploading ? "Uploading..." : "Click or drag image to upload"}
          </div>
          <div className="text-xs text-gray-500 mb-4">
            Recommended: 16:9 aspect ratio (e.g., 1280x720)
          </div>
          
          <div className={disabled ? "opacity-50 pointer-events-none" : ""}>
            <UploadDropzone
              endpoint="courseThumbnail"
              onClientUploadComplete={(res) => {
                const url = res?.[0]?.url;
                if (url) {
                  onChange(url);
                  toast.success("Thumbnail uploaded");
                }
                setIsUploading(false);
              }}
              onUploadError={(error: Error) => {
                toast.error(`Upload failed: ${error.message}`);
                setIsUploading(false);
              }}
              onUploadBegin={() => {
                setIsUploading(true);
              }}
              appearance={{
                button: "bg-black text-white hover:bg-gray-800 text-sm px-4 py-2 rounded-full transition-colors",
                allowedContent: "hidden",
                container: "border-none p-0 mt-0",
                label: "hidden",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
