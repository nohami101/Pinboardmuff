import { type Photo } from "@shared/schema";

export interface UnsplashResponse {
  photos: Photo[];
  total: number;
  totalPages: number;
}

export async function fetchPhotos(
  category: string = "outfits",
  page: number = 1,
  query?: string
): Promise<UnsplashResponse> {
  const params = new URLSearchParams({
    category,
    page: page.toString(),
    per_page: "20",
  });

  if (query) {
    params.append("query", query);
  }

  const response = await fetch(`/api/photos?${params}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch photos: ${response.statusText}`);
  }

  return response.json();
}

export async function searchPhotos(query: string, page: number = 1): Promise<UnsplashResponse> {
  return fetchPhotos("outfits", page, query);
}
