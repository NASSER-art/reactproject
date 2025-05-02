import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import cors from "cors";
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

// Debugging: Log the environment file loading status
if (!process.env.VITE_TMDB_API_KEY) {
  console.error("❌ VITE_TMDB_API_KEY is not set in environment variables. Ensure the .env file is properly configured and loaded.");
  process.exit(1);
} else {
  console.log("✅ VITE_TMDB_API_KEY is loaded successfully.");
}

// Remplacement de la clé API par VITE_TMDB_API_KEY
const TMDB_API_KEY = process.env.VITE_TMDB_API_KEY;
const PORT = process.env.PORT || 5005;

// Vérification de la clé API
if (!TMDB_API_KEY) {
  console.error("❌ VITE_TMDB_API_KEY is not set in environment variables");
  process.exit(1);
}

const app = express();

app.use(cors({
  origin: "*", // Autoriser tous les domaines en développement
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Middleware pour logs API + temps de réponse
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // Setup Vite uniquement en mode développement
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Lancement du serveur
  server.listen({
    port: PORT as number,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`🚀 Serving on port ${PORT}`);
  });
})();
