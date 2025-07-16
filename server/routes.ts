import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertCollectionSchema } from "@shared/schema";

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || "760avCQj5tNL4vYmNGfGLhcbsHEl-vCK5167KyEJEDw";
const UNSPLASH_API_URL = "https://api.unsplash.com";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Fetch photos from Unsplash API
  app.get("/api/photos", async (req, res) => {
    try {
      const { category = "outfits", page = "1", per_page = "20", query } = req.query;
      
      let searchQuery = query as string;
      if (!searchQuery) {
        // Default queries for different categories
        const categoryQueries: Record<string, string> = {
          outfits: "fashion outfit style clothing",
          home: "home interior design decor",
          kitchen: "kitchen design modern interior",
          couples: "couple outfit matching style",
          girls: "women fashion beauty lifestyle",
          cars: "luxury cars automotive"
        };
        searchQuery = categoryQueries[category as string] || "fashion outfit style";
      }
      
      const response = await fetch(
        `${UNSPLASH_API_URL}/search/photos?query=${encodeURIComponent(searchQuery)}&page=${page}&per_page=${per_page}`,
        {
          headers: {
            Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
          },
        }
      );
      
      if (!response.ok) {
        throw new Error(`Unsplash API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      const photos = data.results.map((photo: any) => ({
        id: photo.id,
        unsplashId: photo.id,
        title: photo.alt_description || photo.description || "Untitled",
        description: photo.description || photo.alt_description || "",
        url: photo.urls.regular,
        smallUrl: photo.urls.small,
        photographer: photo.user.name,
        photographerUrl: photo.user.links.html,
        category: category as string,
        tags: photo.tags?.map((tag: any) => tag.title) || [],
        width: photo.width,
        height: photo.height,
        downloadUrl: photo.urls.full,
      }));
      
      // Store photos in memory for potential future use
      for (const photo of photos) {
        await storage.createPhoto(photo);
      }
      
      res.json({
        photos,
        total: data.total,
        totalPages: data.total_pages,
      });
    } catch (error) {
      console.error("Error fetching photos:", error);
      res.status(500).json({ 
        error: "Failed to fetch photos", 
        message: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Get specific photo
  app.get("/api/photos/:id", async (req, res) => {
    try {
      const photo = await storage.getPhoto(req.params.id);
      if (!photo) {
        return res.status(404).json({ error: "Photo not found" });
      }
      res.json(photo);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch photo" });
    }
  });

  // Collections routes
  app.get("/api/collections", async (req, res) => {
    try {
      const collections = await storage.getAllCollections();
      res.json(collections);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch collections" });
    }
  });

  app.post("/api/collections", async (req, res) => {
    try {
      const validatedData = insertCollectionSchema.parse(req.body);
      const collection = await storage.createCollection(validatedData);
      res.status(201).json(collection);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create collection" });
    }
  });

  app.get("/api/collections/:id", async (req, res) => {
    try {
      const collection = await storage.getCollection(req.params.id);
      if (!collection) {
        return res.status(404).json({ error: "Collection not found" });
      }
      res.json(collection);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch collection" });
    }
  });

  app.put("/api/collections/:id", async (req, res) => {
    try {
      const updates = req.body;
      const collection = await storage.updateCollection(req.params.id, updates);
      if (!collection) {
        return res.status(404).json({ error: "Collection not found" });
      }
      res.json(collection);
    } catch (error) {
      res.status(500).json({ error: "Failed to update collection" });
    }
  });

  app.delete("/api/collections/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteCollection(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Collection not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete collection" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
