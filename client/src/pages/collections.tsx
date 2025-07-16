import { useState } from "react";
import { type LocalCollection, type Photo } from "@shared/schema";
import { useCollections } from "@/hooks/use-collections";
import PhotoGrid from "@/components/photo-grid";
import PhotoViewer from "@/components/photo-viewer";
import CreateCollectionModal from "@/components/create-collection-modal";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Folder, Plus, Trash2, X } from "lucide-react";

export default function Collections() {
  const { collections, deleteCollection, removePhotoFromCollection } = useCollections();
  const [selectedCollection, setSelectedCollection] = useState<LocalCollection | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);
  const [isPhotoViewerOpen, setIsPhotoViewerOpen] = useState(false);

  const handleOpenCollection = (collection: LocalCollection) => {
    setSelectedCollection(collection);
    setIsDetailModalOpen(true);
  };

  const handleRemovePhoto = (photoId: string) => {
    if (!selectedCollection) return;
    
    removePhotoFromCollection(selectedCollection.id, photoId);
    
    // Update the selected collection to reflect the change
    const updatedCollection = {
      ...selectedCollection,
      photos: selectedCollection.photos.filter(p => p.id !== photoId)
    };
    setSelectedCollection(updatedCollection);
  };

  const handleDeleteCollection = (collectionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (confirm("Are you sure you want to delete this collection?")) {
      deleteCollection(collectionId);
    }
  };

  return (
    <div className="pt-16 sm:pt-20 pb-8 bg-white dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-200">My Collections</h2>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-pinterest-red hover:bg-red-700 text-white rounded-full w-full sm:w-auto"
            size="sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Collection
          </Button>
        </div>

        {collections.length === 0 ? (
          <div className="text-center py-8 sm:py-12 px-4">
            <Folder className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-medium text-gray-500 dark:text-gray-400 mb-2">No collections yet</h3>
            <p className="text-gray-400 dark:text-gray-500 mb-4 text-sm sm:text-base">
              Start creating collections to organize your favorite photos
            </p>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-pinterest-red hover:bg-red-700 text-white rounded-full"
            >
              Create Your First Collection
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {collections.map((collection) => (
              <div
                key={collection.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                onClick={() => handleOpenCollection(collection)}
              >
                <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-t-lg overflow-hidden relative">
                  {collection.photos.length > 0 ? (
                    <img
                      src={collection.photos[0].smallUrl}
                      alt={collection.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Folder className="h-12 w-12 text-gray-300 dark:text-gray-600" />
                    </div>
                  )}
                  
                  <Button
                    onClick={(e) => handleDeleteCollection(collection.id, e)}
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="p-3 sm:p-4">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1 truncate text-sm sm:text-base">
                    {collection.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2 hidden sm:block">
                    {collection.description || "No description"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {collection.photos.length} photos
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Collection Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
          <DialogHeader className="border-b pb-4">
            <div className="flex justify-between items-center">
              <div>
                <DialogTitle className="text-2xl font-bold">
                  {selectedCollection?.name}
                </DialogTitle>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {selectedCollection?.description || "No description"}
                </p>
              </div>
              <Button
                onClick={() => setIsDetailModalOpen(false)}
                variant="ghost"
                size="icon"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          
          <div className="p-6 overflow-y-auto max-h-[70vh]">
            {selectedCollection?.photos.length === 0 ? (
              <div className="text-center py-12">
                <Folder className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">This collection is empty</p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                  Browse photos and save them to this collection
                </p>
              </div>
            ) : (
              <PhotoGrid
                photos={selectedCollection?.photos || []}
                onSavePhoto={() => {}} // Not needed in collection view
                onViewPhoto={(photo) => {
                  const photoIndex = selectedCollection?.photos.findIndex(p => p.id === photo.id) || 0;
                  setSelectedPhotoIndex(photoIndex >= 0 ? photoIndex : 0);
                  setIsPhotoViewerOpen(true);
                }}
                showRemove={true}
                onRemovePhoto={handleRemovePhoto}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Photo Viewer */}
      {selectedCollection && (
        <PhotoViewer
          photos={selectedCollection.photos}
          currentIndex={selectedPhotoIndex}
          isOpen={isPhotoViewerOpen}
          onClose={() => setIsPhotoViewerOpen(false)}
          onSave={() => {}} // Not needed in collection view
        />
      )}

      {/* Create Collection Modal */}
      <CreateCollectionModal
        photo={null}
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
