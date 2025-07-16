import { X, Download, Heart } from "lucide-react";
import { type Photo } from "@shared/schema";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PhotoModalProps {
  photo: Photo | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (photo: Photo) => void;
}

export default function PhotoModal({ photo, isOpen, onClose, onSave }: PhotoModalProps) {
  if (!photo) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = photo.downloadUrl || photo.url;
    link.download = `${photo.title}.jpg`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden p-0 m-2 sm:m-0">
        <div className="relative">
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-white/80 hover:bg-white z-10 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
          
          <img
            src={photo.url}
            alt={photo.title}
            className="w-full h-auto max-h-[60vh] sm:max-h-[80vh] object-contain"
          />
          
          <div className="p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
              {photo.title}
            </h3>
            {photo.description && (
              <p className="text-gray-600 mb-4 text-sm sm:text-base">{photo.description}</p>
            )}
            <p className="text-sm text-gray-500 mb-4">
              Photo by{" "}
              <a
                href={photo.photographerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pinterest-red hover:underline"
              >
                {photo.photographer}
              </a>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button
                onClick={() => onSave(photo)}
                className="bg-pinterest-red hover:bg-red-700 text-white rounded-full flex-1 sm:flex-none"
              >
                <Heart className="mr-2 h-4 w-4" />
                Save
              </Button>
              <Button
                onClick={handleDownload}
                variant="outline"
                className="rounded-full flex-1 sm:flex-none"
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
