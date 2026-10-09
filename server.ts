import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Healthcheck endpoint for Render
app.get('/api/health', (_req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'H2derm Official Store'
  });
});

// Serve built static assets from dist folder
const distPath = path.resolve(__dirname, 'dist');
const indexPath = path.join(distPath, 'index.html');

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

// Fallback to index.html for SPA routing (e.g. /admin, /tracking, etc.)
app.get('*', (_req, res) => {
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head><title>H2derm Store - Modo Local</title></head>
        <body style="font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #fafafa;">
          <div style="background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 20px rgba(0,0,0,0.1); max-width: 500px; text-align: center;">
            <h2 style="color: #6b21a8;">H2derm Store</h2>
            <p>Para ver la tienda en desarrollo local con recarga rápida, ejecuta en tu terminal:</p>
            <code style="background: #f3e8ff; color: #581c87; padding: 0.5rem 1rem; border-radius: 0.5rem; display: block; font-size: 1.1rem; font-weight: bold;">npm run dev</code>
            <p style="margin-top: 1rem; color: #64748b; font-size: 0.85rem;">O compila para producción con: <code>npm run build</code> y luego <code>npm start</code>.</p>
          </div>
        </body>
      </html>
    `);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 H2derm store server is running on port ${PORT}`);
  console.log(`🌍 Health check available at: http://localhost:${PORT}/api/health`);
});

