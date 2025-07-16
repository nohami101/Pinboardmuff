import { photos, collections, type Photo, type Collection, type InsertPhoto, type InsertCollection } from "@shared/schema";

export interface IStorage {
  // Photo operations
  getPhoto(id: string): Promise<Photo | undefined>;
  createPhoto(photo: InsertPhoto): Promise<Photo>;
  getPhotosByCategory(category: string): Promise<Photo[]>;
  searchPhotos(query: string): Promise<Photo[]>;
  
  // Collection operations
  getCollection(id: string): Promise<Collection | undefined>;
  createCollection(collection: InsertCollection): Promise<Collection>;
  getAllCollections(): Promise<Collection[]>;
  updateCollection(id: string, updates: Partial<Collection>): Promise<Collection | undefined>;
  deleteCollection(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private photos: Map<string, Photo>;
  private collections: Map<string, Collection>;

  constructor() {
    this.photos = new Map();
    this.collections = new Map();
  }

  async getPhoto(id: string): Promise<Photo | undefined> {
    return this.photos.get(id);
  }

  async createPhoto(insertPhoto: InsertPhoto): Promise<Photo> {
    const photo: Photo = {
      ...insertPhoto,
      description: insertPhoto.description || null,
      photographerUrl: insertPhoto.photographerUrl || null,
      tags: insertPhoto.tags || null,
      downloadUrl: insertPhoto.downloadUrl || null,
    };
    this.photos.set(photo.id, photo);
    return photo;
  }

  async getPhotosByCategory(category: string): Promise<Photo[]> {
    return Array.from(this.photos.values()).filter(
      photo => photo.category === category
    );
  }

  async searchPhotos(query: string): Promise<Photo[]> {
    const searchTerm = query.toLowerCase();
    return Array.from(this.photos.values()).filter(photo => 
      photo.title.toLowerCase().includes(searchTerm) ||
      photo.description?.toLowerCase().includes(searchTerm) ||
      photo.category.toLowerCase().includes(searchTerm) ||
      photo.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }

  async getCollection(id: string): Promise<Collection | undefined> {
    return this.collections.get(id);
  }

  async createCollection(insertCollection: InsertCollection): Promise<Collection> {
    const id = Date.now().toString();
    const collection: Collection = {
      ...insertCollection,
      id,
      description: insertCollection.description || null,
      photoIds: insertCollection.photoIds || [],
      createdAt: new Date(),
    };
    this.collections.set(id, collection);
    return collection;
  }

  async getAllCollections(): Promise<Collection[]> {
    return Array.from(this.collections.values());
  }

  async updateCollection(id: string, updates: Partial<Collection>): Promise<Collection | undefined> {
    const collection = this.collections.get(id);
    if (!collection) return undefined;
    
    const updatedCollection = { ...collection, ...updates };
    this.collections.set(id, updatedCollection);
    return updatedCollection;
  }

  async deleteCollection(id: string): Promise<boolean> {
    return this.collections.delete(id);
  }
}

export const storage = new MemStorage();
