"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";

type VideoPlayerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title: string;
};

export default function VideoPlayerModal({
  isOpen,
  onClose,
  videoUrl,
  title,
}: VideoPlayerModalProps) {
  console.log("VideoPlayerModal URL:", videoUrl);
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[90vw] md:max-w-4xl p-0 bg-black border-none" aria-describedby={undefined}>
        <div className="relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute -top-12 right-0 z-50 bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
            aria-label="Close video player"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Video Title - Now serves as DialogTitle */}
          <div className="absolute top-0 left-0 right-0 z-40 bg-gradient-to-b from-black/80 to-transparent p-6">
            <DialogTitle className="text-white text-xl font-bold">{title}</DialogTitle>
          </div>

          {/* Video Player */}
          <div className="relative aspect-video bg-black flex items-center justify-center">
            <video
              src={videoUrl}
              controls
              autoPlay
              className="w-full h-full"
              controlsList="nodownload"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
