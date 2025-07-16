import { useState, useEffect, useCallback } from "react";
import { X, Heart, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { type Photo } from "@shared/schema";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PhotoViewerProps {
  photos: Photo[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onSave: (photo: Photo) => void;
}

export default function PhotoViewer({ 
  photos, 
  currentIndex, 
  isOpen, 
  onClose, 
  onSave 
}: PhotoViewerProps) {
  const [index, setIndex] = useState(currentIndex);

  const goToPrevious = useCallback(() => {
    setIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
  }, [photos.length]);

  const goToNext = useCallback(() => {
    setIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
  }, [photos.length]);

  useEffect(() => {
    setIndex(currentIndex);
  }, [currentIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, goToPrevious, goToNext, onClose]);

  const currentPhoto = photos[index];
  if (!currentPhoto) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = currentPhoto.downloadUrl || currentPhoto.url;
    link.download = `${currentPhoto.title}.jpg`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-hidden p-0 bg-black">
        {/* Close button */}
        <Button
          onClick={onClose}
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white z-10 rounded-full"
        >
          <X className="h-5 w-5" />
        </Button>

        {/* Navigation arrows */}
        {photos.length > 1 && (
          <>
            <Button
              onClick={goToPrevious}
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white z-10 rounded-full"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              onClick={goToNext}
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white z-10 rounded-full"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </>
        )}

        {/* Photo counter */}
        {photos.length > 1 && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm z-10">
            {index + 1} / {photos.length}
          </div>
        )}

        {/* Main photo */}
        <div className="relative w-full h-full flex items-center justify-center bg-black">
          <img
            src={currentPhoto.url}
            alt={currentPhoto.title}
            className="max-w-full max-h-full object-contain"
            style={{ maxHeight: '85vh' }}
          />
        </div>

        {/* Bottom info panel */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 sm:p-6">
          <div className="text-white">
            <h3 className="text-lg sm:text-xl font-semibold mb-2">
              {currentPhoto.title}
            </h3>
            {currentPhoto.description && (
              <p className="text-sm sm:text-base text-gray-300 mb-3">
                {currentPhoto.description}
              </p>
            )}
            <p className="text-sm text-gray-400 mb-4">
              Photo by{" "}
              <a
                href={currentPhoto.photographerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pinterest-red hover:underline"
              >
                {currentPhoto.photographer}
              </a>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button
                onClick={() => onSave(currentPhoto)}
                className="bg-pinterest-red hover:bg-red-700 text-white rounded-full flex-1 sm:flex-none"
              >
                <Heart className="mr-2 h-4 w-4" />
                Save
              </Button>
              <Button
                onClick={handleDownload}
                variant="outline"
                className="rounded-full flex-1 sm:flex-none border-white/30 text-white hover:bg-white/10"
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}