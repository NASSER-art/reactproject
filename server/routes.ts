import type { Express } from "express";
import { createServer, type Server } from "http";
import { tmdbProxy } from "./tmdb";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  // Prefix all TMDb API routes with /api
  const apiPrefix = '/api';

  // Trending endpoints
  app.get(`${apiPrefix}/trending/:mediaType/:timeWindow`, tmdbProxy);

  // Movie endpoints
  app.get(`${apiPrefix}/movie/popular`, tmdbProxy);
  app.get(`${apiPrefix}/movie/:id`, tmdbProxy);
  app.get(`${apiPrefix}/movie/:id/credits`, tmdbProxy);
  app.get(`${apiPrefix}/movie/:id/videos`, tmdbProxy);
  app.get(`${apiPrefix}/movie/:id/watch/providers`, tmdbProxy);

  // TV show endpoints
  app.get(`${apiPrefix}/tv/popular`, tmdbProxy);
  app.get(`${apiPrefix}/tv/:id`, tmdbProxy);
  app.get(`${apiPrefix}/tv/:id/credits`, tmdbProxy);
  app.get(`${apiPrefix}/tv/:id/videos`, tmdbProxy);
  app.get(`${apiPrefix}/tv/:id/watch/providers`, tmdbProxy);

  // Search endpoints
  app.get(`${apiPrefix}/search/movie`, tmdbProxy);
  app.get(`${apiPrefix}/search/tv`, tmdbProxy);
  app.get(`${apiPrefix}/search/multi`, tmdbProxy);

  // Genre endpoints
  app.get(`${apiPrefix}/genre/movie/list`, tmdbProxy);
  app.get(`${apiPrefix}/genre/tv/list`, tmdbProxy);

  // Discover endpoints
  app.get(`${apiPrefix}/discover/movie`, tmdbProxy);
  app.get(`${apiPrefix}/discover/tv`, tmdbProxy);

  const httpServer = createServer(app);

  return httpServer;
}
