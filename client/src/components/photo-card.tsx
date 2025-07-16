import { useState } from "react";
import { Heart } from "lucide-react";
import { type Photo } from "@shared/schema";
import { Button } from "@/components/ui/button";

interface PhotoCardProps {
  photo: Photo;
  onSave: (photo: Photo) => void;
  onView: (photo: Photo) => void;
  showRemove?: boolean;
  onRemove?: (photoId: string) => void;
}

export default function PhotoCard({ 
  photo, 
  onSave, 
  onView, 
  showRemove = false, 
  onRemove 
}: PhotoCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="masonry-item"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="photo-card relative bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-lg cursor-pointer transition-all duration-200 hover:scale-[1.02]">
        <img
          src={photo.smallUrl}
          alt={photo.title}
          className="w-full h-auto"
          loading="lazy"
          onClick={() => onView(photo)}
        />
        
        {isHovered && (
          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
            {showRemove && onRemove ? (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(photo.id);
                }}
                className="bg-red-500 hover:bg-red-600 text-white rounded-full text-sm"
                size="sm"
              >
                Remove
              </Button>
            ) : (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onSave(photo);
                }}
                className="bg-pinterest-red hover:bg-red-700 text-white rounded-full"
              >
                <Heart className="mr-2 h-4 w-4" />
                Save
              </Button>
            )}
          </div>
        )}
        
        <div className="p-2 sm:p-3">
          <h4 className="font-medium text-gray-800 dark:text-gray-200 truncate text-sm sm:text-base">{photo.title}</h4>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">by {photo.photographer}</p>
        </div>
      </div>
    </div>
  );
}
