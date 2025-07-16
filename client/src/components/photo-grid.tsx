import { type Photo } from "@shared/schema";
import PhotoCard from "./photo-card";

interface PhotoGridProps {
  photos: Photo[];
  onSavePhoto: (photo: Photo) => void;
  onViewPhoto: (photo: Photo) => void;
  showRemove?: boolean;
  onRemovePhoto?: (photoId: string) => void;
}

export default function PhotoGrid({ 
  photos, 
  onSavePhoto, 
  onViewPhoto, 
  showRemove = false, 
  onRemovePhoto 
}: PhotoGridProps) {
  return (
    <div className="masonry-grid">
      {photos.map((photo) => (
        <PhotoCard
          key={photo.id}
          photo={photo}
          onSave={onSavePhoto}
          onView={onViewPhoto}
          showRemove={showRemove}
          onRemove={onRemovePhoto}
        />
      ))}
    </div>
  );
}
