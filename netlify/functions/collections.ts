import { Handler } from '@netlify/functions';

// Simple in-memory storage for demo purposes
// In a real app, you'd use a database like Supabase, FaunaDB, or Airtable
let collections: any[] = [];

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

  const headers = {
    ...corsHeaders,
    'Content-Type': 'application/json',
  };

  try {
    switch (event.httpMethod) {
      case 'GET':
        // Handle GET /api/collections
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(collections),
        };

      case 'POST':
        // Handle POST /api/collections
        if (!event.body) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Request body is required' }),
          };
        }

        const newCollection = JSON.parse(event.body);
        const collection = {
          ...newCollection,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          description: newCollection.description || null,
          photoIds: newCollection.photoIds || [],
        };
        
        collections.push(collection);
        
        return {
          statusCode: 201,
          headers,
          body: JSON.stringify(collection),
        };

      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ error: 'Method not allowed' }),
        };
    }
  } catch (error) {
    console.error('Error in collections function:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
}; 