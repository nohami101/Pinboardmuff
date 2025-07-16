import { type Photo, type LocalCollection } from "@shared/schema";

const STORAGE_KEY = "pingallery_collections";

export function getCollections(): LocalCollection[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error loading collections from localStorage:", error);
    return [];
  }
}

export function saveCollections(collections: LocalCollection[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(collections));
  } catch (error) {
    console.error("Error saving collections to localStorage:", error);
    throw new Error("Failed to save collections");
  }
}

export function createCollection(name: string, description?: string): LocalCollection {
  const collections = getCollections();
  const newCollection: LocalCollection = {
    id: Date.now().toString(),
    name,
    description,
    photos: [],
    createdAt: new Date().toISOString(),
  };
  
  collections.push(newCollection);
  saveCollections(collections);
  return newCollection;
}

export function addPhotoToCollection(collectionId: string, photo: Photo): void {
  const collections = getCollections();
  const collection = collections.find(c => c.id === collectionId);
  
  if (!collection) {
    throw new Error("Collection not found");
  }
  
  // Check if photo already exists in collection
  if (!collection.photos.some(p => p.id === photo.id)) {
    collection.photos.push(photo);
    saveCollections(collections);
  }
}

export function removePhotoFromCollection(collectionId: string, photoId: string): void {
  const collections = getCollections();
  const collection = collections.find(c => c.id === collectionId);
  
  if (!collection) {
    throw new Error("Collection not found");
  }
  
  collection.photos = collection.photos.filter(p => p.id !== photoId);
  saveCollections(collections);
}

export function deleteCollection(collectionId: string): void {
  const collections = getCollections();
  const filteredCollections = collections.filter(c => c.id !== collectionId);
  saveCollections(filteredCollections);
}

export function getCollection(collectionId: string): LocalCollection | undefined {
  const collections = getCollections();
  return collections.find(c => c.id === collectionId);
}
