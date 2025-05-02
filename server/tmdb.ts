import { Request, Response, NextFunction } from 'express';
import https from 'https';

// Configuration for TMDb API
const TMDB_API_URL = 'https://api.themoviedb.org/3';
// The API Key will be fetched from environment variables
const TMDB_API_KEY = process.env.TMDB_API_KEY || '';

if (!TMDB_API_KEY) {
  console.error('TMDB_API_KEY is not set in environment variables');
}

/**
 * Proxy function to forward requests to TMDb API
 */
export async function tmdbProxy(req: Request, res: Response, next: NextFunction) {
  try {
    // Validate API Key
    if (!TMDB_API_KEY) {
      return res.status(500).json({ 
        message: 'API key not configured', 
        error: 'TMDb API key is missing. Please set TMDB_API_KEY environment variable.' 
      });
    }

    // Get the path after /api/
    const path = req.path.replace(/^\/api/, '');
    
    // Build the TMDb API URL with API key
    let tmdbUrl = `${TMDB_API_URL}${path}?api_key=${TMDB_API_KEY}`;
    
    // Add query parameters if they exist
    if (Object.keys(req.query).length > 0) {
      const queryParams = new URLSearchParams();
      
      // Copy all query parameters except those that might be sensitive
      for (const [key, value] of Object.entries(req.query)) {
        if (key !== 'api_key' && value !== undefined) {
          queryParams.append(key, value as string);
        }
      }
      
      // Append query parameters to URL
      if (queryParams.toString()) {
        tmdbUrl += `&${queryParams.toString()}`;
      }
    }
    
    // Set default language to French if not specified
    if (!tmdbUrl.includes('language=')) {
      tmdbUrl += '&language=fr-FR';
    }

    // Make the request to TMDb API
    const tmdbResponse = await fetch(tmdbUrl);
    
    // Check if the request was successful
    if (!tmdbResponse.ok) {
      const errorText = await tmdbResponse.text();
      let errorData;
      
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { message: errorText };
      }
      
      // Log error details
      console.error(`TMDb API Error: ${tmdbResponse.status} ${tmdbResponse.statusText}`, errorData);
      
      // Return error response
      return res.status(tmdbResponse.status).json({
        message: 'Error from TMDb API',
        error: errorData
      });
    }
    
    // Get the response data
    const data = await tmdbResponse.json();
    
    // Return the data
    return res.json(data);
  } catch (error) {
    console.error('Error proxying request to TMDb:', error);
    next(error);
  }
}

// TMDB Rate Limit: 40 requests every 10 seconds
// Implement a rate limiter if needed for high traffic applications
