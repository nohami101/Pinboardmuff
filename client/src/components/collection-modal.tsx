import { useState } from "react";
import { type Photo, type LocalCollection } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Folder } from "lucide-react";
import { useCollections } from "@/hooks/use-collections";

interface CollectionModalProps {
  photo: Photo | null;
  isOpen: boolean;
  onClose: () => void;
  onCreateNew: () => void;
}

export default function CollectionModal({ 
  photo, 
  isOpen, 
  onClose, 
  onCreateNew 
}: CollectionModalProps) {
  const { collections, addPhotoToCollection } = useCollections();

  const handleAddToCollection = (collectionId: string) => {
    if (!photo) return;
    
    try {
      addPhotoToCollection(collectionId, photo);
      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      notification.textContent = 'Photo saved to collection!';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 3000);
      
      onClose();
    } catch (error) {
      console.error('Error adding photo to collection:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-4 sm:mx-0">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Save to Collection</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-2 max-h-48 sm:max-h-60 overflow-y-auto">
          {collections.map((collection) => (
            <div
              key={collection.id}
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
              onClick={() => handleAddToCollection(collection.id)}
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-lg mr-3 flex items-center justify-center">
                  <Folder className="h-6 w-6 text-gray-500" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">{collection.name}</h4>
                  <p className="text-sm text-gray-600">
                    {collection.photos.length} photos
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-pinterest-red hover:text-red-700"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={onCreateNew}
            className="bg-pinterest-red hover:bg-red-700 text-white rounded-full"
          >
            Create New
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
