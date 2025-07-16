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

  // Extract collection ID from the path
  const pathSegments = event.path.split('/');
  const collectionId = pathSegments[pathSegments.length - 1];

  if (!collectionId) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Collection ID is required' }),
    };
  }

  try {
    switch (event.httpMethod) {
      case 'GET':
        // Handle GET /api/collections/:id
        const collection = collections.find(c => c.id === collectionId);
        if (!collection) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'Collection not found' }),
          };
        }
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(collection),
        };

      case 'PUT':
        // Handle PUT /api/collections/:id
        if (!event.body) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Request body is required' }),
          };
        }

        const updates = JSON.parse(event.body);
        const collectionIndex = collections.findIndex(c => c.id === collectionId);
        
        if (collectionIndex === -1) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'Collection not found' }),
          };
        }

        collections[collectionIndex] = { ...collections[collectionIndex], ...updates };
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(collections[collectionIndex]),
        };

      case 'DELETE':
        // Handle DELETE /api/collections/:id
        const deleteIndex = collections.findIndex(c => c.id === collectionId);
        
        if (deleteIndex === -1) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'Collection not found' }),
          };
        }

        collections.splice(deleteIndex, 1);
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true }),
        };

      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ error: 'Method not allowed' }),
        };
    }
  } catch (error) {
    console.error('Error in collections-id function:', error);
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