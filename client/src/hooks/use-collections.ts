import { useState, useEffect } from "react";
import { type LocalCollection, type Photo } from "@shared/schema";
import { 
  getCollections, 
  saveCollections, 
  createCollection as createNewCollection,
  addPhotoToCollection as addToCollection,
  removePhotoFromCollection as removeFromCollection,
  deleteCollection as removeCollection
} from "@/lib/storage";

export function useCollections() {
  const [collections, setCollections] = useState<LocalCollection[]>([]);

  useEffect(() => {
    setCollections(getCollections());
  }, []);

  const refreshCollections = () => {
    setCollections(getCollections());
  };

  const createCollection = (name: string, description?: string) => {
    const newCollection = createNewCollection(name, description);
    refreshCollections();
    return newCollection;
  };

  const addPhotoToCollection = (collectionId: string, photo: Photo) => {
    addToCollection(collectionId, photo);
    refreshCollections();
  };

  const removePhotoFromCollection = (collectionId: string, photoId: string) => {
    removeFromCollection(collectionId, photoId);
    refreshCollections();
  };

  const deleteCollection = (collectionId: string) => {
    removeCollection(collectionId);
    refreshCollections();
  };

  return {
    collections,
    createCollection,
    addPhotoToCollection,
    removePhotoFromCollection,
    deleteCollection,
    refreshCollections,
  };
}
