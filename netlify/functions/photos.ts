import { Handler } from '@netlify/functions';

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || "760avCQj5tNL4vYmNGfGLhcbsHEl-vCK5167KyEJEDw";
const UNSPLASH_API_URL = "https://api.unsplash.com";

export const handler: Handler = async (event, context) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  };

  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: '',
    };
  }

  // Only handle GET requests for photos
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { category = "outfits", page = "1", per_page = "20", query } = event.queryStringParameters || {};
    
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
    
    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        photos,
        total: data.total,
        totalPages: data.total_pages,
      }),
    };
  } catch (error) {
    console.error("Error fetching photos:", error);
    return {
      statusCode: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        error: "Failed to fetch photos", 
        message: error instanceof Error ? error.message : "Unknown error" 
      }),
    };
  }
}; 