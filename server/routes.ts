import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  // Prefix all TMDb API routes with /api
  const apiPrefix = '/api';

  // Trending endpoints
  app.get(`${apiPrefix}/trending/:mediaType/:timeWindow`, () => {});

  // Movie endpoints
  app.get(`${apiPrefix}/movie/popular`, () => {});
  app.get(`${apiPrefix}/movie/:id`, () => {});
  app.get(`${apiPrefix}/movie/:id/credits`, () => {});
  app.get(`${apiPrefix}/movie/:id/videos`, () => {});
  app.get(`${apiPrefix}/movie/:id/watch/providers`, () => {});

  // TV show endpoints
  app.get(`${apiPrefix}/tv/popular`, () => {});
  app.get(`${apiPrefix}/tv/:id`, () => {});
  app.get(`${apiPrefix}/tv/:id/credits`, () => {});
  app.get(`${apiPrefix}/tv/:id/videos`, () => {});
  app.get(`${apiPrefix}/tv/:id/watch/providers`, () => {});

  // Search endpoints
  app.get(`${apiPrefix}/search/movie`, () => {});
  app.get(`${apiPrefix}/search/tv`, () => {});
  app.get(`${apiPrefix}/search/multi`, () => {});

  // Genre endpoints
  app.get(`${apiPrefix}/genre/movie/list`, () => {});
  app.get(`${apiPrefix}/genre/tv/list`, () => {});

  // Discover endpoints
  app.get(`${apiPrefix}/discover/movie`, () => {});
  app.get(`${apiPrefix}/discover/tv`, () => {});

  const httpServer = createServer(app);

  return httpServer;
}
