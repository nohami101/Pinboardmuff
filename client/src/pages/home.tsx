import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { type Photo } from "@shared/schema";
import { fetchPhotos } from "@/lib/unsplash";
import PhotoGrid from "@/components/photo-grid";
import PhotoViewer from "@/components/photo-viewer";
import CollectionModal from "@/components/collection-modal";
import CreateCollectionModal from "@/components/create-collection-modal";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface HomeProps {
  searchQuery: string;
}

export default function Home({ searchQuery }: HomeProps) {
  const [currentCategory, setCurrentCategory] = useState("outfits");
  const [currentPage, setCurrentPage] = useState(1);
  const [allPhotos, setAllPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);
  const [isPhotoViewerOpen, setIsPhotoViewerOpen] = useState(false);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const categories = [
    { id: "outfits", label: "Outfits", icon: "👕" },
    { id: "home", label: "Home Design", icon: "🏠" },
    { id: "kitchen", label: "Kitchen", icon: "🍳" },
    { id: "couples", label: "Couple Outfits", icon: "💑" },
    { id: "girls", label: "Girls' Style", icon: "💄" },
    { id: "cars", label: "Cars", icon: "🚗" },
  ];

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["/api/photos", currentCategory, currentPage, searchQuery],
    queryFn: () => fetchPhotos(
      currentCategory,
      currentPage,
      searchQuery || undefined
    ),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    if (data?.photos) {
      if (currentPage === 1) {
        setAllPhotos(data.photos);
      } else {
        setAllPhotos(prev => [...prev, ...data.photos]);
      }
    }
  }, [data, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
    setAllPhotos([]);
  }, [currentCategory, searchQuery]);

  const handleCategoryChange = (category: string) => {
    setCurrentCategory(category);
    setCurrentPage(1);
    setAllPhotos([]);
  };

  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  const handleSavePhoto = (photo: Photo) => {
    setSelectedPhoto(photo);
    setIsCollectionModalOpen(true);
  };

  const handleViewPhoto = (photo: Photo) => {
    console.log('Photo clicked:', photo.id);
    const photoIndex = allPhotos.findIndex(p => p.id === photo.id);
    console.log('Photo index:', photoIndex);
    setSelectedPhoto(photo);
    setSelectedPhotoIndex(photoIndex >= 0 ? photoIndex : 0);
    setIsPhotoViewerOpen(true);
    console.log('Photo viewer should open');
  };

  const handleCreateNewCollection = () => {
    setIsCollectionModalOpen(false);
    setIsCreateModalOpen(true);
  };

  if (error) {
    return (
      <div className="pt-16 sm:pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 text-center py-8 sm:py-12">
          <div className="text-red-500 mb-4">
            <p className="text-base sm:text-lg font-medium">Failed to load photos</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 px-4">
              {error instanceof Error ? error.message : "Please check your internet connection and try again."}
            </p>
          </div>
          <Button onClick={() => refetch()} className="bg-pinterest-red hover:bg-red-700 text-white">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 sm:pt-20 pb-8 bg-white dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        {/* Category Filters */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
            {categories.map((category) => (
              <Button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                variant={currentCategory === category.id ? "default" : "outline"}
                size="sm"
                className={`rounded-full font-medium flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm ${
                  currentCategory === category.id
                    ? "bg-pinterest-red hover:bg-red-700 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                <span className="text-xs sm:text-sm">{category.icon}</span>
                <span className="hidden xs:inline">{category.label}</span>
                <span className="xs:hidden">{category.label.split(' ')[0]}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Photo Grid */}
        {allPhotos.length > 0 && (
          <PhotoGrid
            photos={allPhotos}
            onSavePhoto={handleSavePhoto}
            onViewPhoto={handleViewPhoto}
          />
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-6 sm:py-8">
            <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-pinterest-red mx-auto" />
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm sm:text-base">Loading photos...</p>
          </div>
        )}

        {/* Load More Button */}
        {!isLoading && data && data.totalPages > currentPage && (
          <div className="text-center mt-6 sm:mt-8">
            <Button
              onClick={handleLoadMore}
              variant="outline"
              className="rounded-full px-6 py-2"
            >
              Load More Photos
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && allPhotos.length === 0 && (
          <div className="text-center py-8 sm:py-12 px-4">
            <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg">No photos found</p>
            <p className="text-gray-400 dark:text-gray-500 mt-2 text-sm sm:text-base">Try adjusting your search or category filter</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <PhotoViewer
        photos={allPhotos}
        currentIndex={selectedPhotoIndex}
        isOpen={isPhotoViewerOpen}
        onClose={() => {
          setIsPhotoViewerOpen(false);
          setSelectedPhoto(null);
        }}
        onSave={handleSavePhoto}
      />

      <CollectionModal
        photo={selectedPhoto}
        isOpen={isCollectionModalOpen}
        onClose={() => {
          setIsCollectionModalOpen(false);
          setSelectedPhoto(null);
        }}
        onCreateNew={handleCreateNewCollection}
      />

      <CreateCollectionModal
        photo={selectedPhoto}
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setSelectedPhoto(null);
        }}
      />
    </div>
  );
}
