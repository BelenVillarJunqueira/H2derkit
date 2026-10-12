import dotenv from 'dotenv';
// Load environment variables immediately
dotenv.config();

import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { 
  connectMongoDB, 
  isMongoConnected, 
  getMongoStatus,
  StoreConfigModel, 
  OrderModel, 
  ImageModel 
} from './src/db/mongo';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Connect to MongoDB if MONGODB_URI is provided
connectMongoDB().catch(err => {
  console.warn('MongoDB connection notice:', err.message);
});

// Ensure directories exist
const dataDir = path.resolve(__dirname, 'data');
const uploadsDir = path.resolve(__dirname, 'uploads');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// Body parsing with generous limit for images
app.use(express.json({ limit: '60mb' }));
app.use(express.urlencoded({ limit: '60mb', extended: true }));

// Helper: Read JSON file safely
const readJsonFile = <T>(filePath: string, fallback: T): T => {
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
  }
  return fallback;
};

// Helper: Write JSON file safely
const writeJsonFile = (filePath: string, data: any): void => {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
  }
};

// Helper: Save Base64 string to both disk and MongoDB Atlas
const saveBase64File = async (base64String: string, prefix = 'img'): Promise<{ url: string; filename: string }> => {
  if (!base64String || typeof base64String !== 'string') return { url: base64String, filename: '' };
  if (!base64String.startsWith('data:')) return { url: base64String, filename: '' };

  const matches = base64String.match(/^data:([A-Za-z0-9-+/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) return { url: base64String, filename: '' };

  const mimeType = matches[1];
  const base64Data = matches[2];
  let ext = 'jpg';
  if (mimeType.includes('png')) ext = 'png';
  else if (mimeType.includes('webp')) ext = 'webp';
  else if (mimeType.includes('gif')) ext = 'gif';
  else if (mimeType.includes('mp4')) ext = 'mp4';
  else if (mimeType.includes('webm')) ext = 'webm';
  else if (mimeType.includes('quicktime') || mimeType.includes('mov')) ext = 'mov';
  else if (mimeType.includes('video')) ext = 'mp4';

  const filename = `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${ext}`;
  const filePath = path.join(uploadsDir, filename);

  // 1. Write to local disk cache
  try {
    fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));
  } catch (err) {
    console.error('Error saving uploaded file to disk:', err);
  }

  // 2. Persist permanently to MongoDB Atlas (guarantees files survive Render restarts)
  if (isMongoConnected()) {
    // Only persist in Mongo if under BSON 15MB limit to prevent BSONObjectTooLarge error
    if (base64Data.length < 15 * 1024 * 1024) {
      try {
        await ImageModel.findOneAndUpdate(
          { id: filename },
          { 
            id: filename, 
            data: base64Data, 
            contentType: mimeType, 
            filename,
            sizeKb: Math.round(base64Data.length * 0.75 / 1024),
            createdAt: new Date() 
          },
          { upsert: true }
        );
      } catch (mongoErr) {
        console.error('Error saving file to MongoDB Atlas:', mongoErr);
      }
    }
  }

  return { url: `/uploads/${filename}`, filename };
};

// Helper: Automatically scan and persist any embedded Base64 images into MongoDB
const extractAndPersistBase64Images = async (data: any, prefix = 'item'): Promise<any> => {
  if (!data) return data;
  if (typeof data === 'string') {
    if (data.startsWith('data:image/') || data.startsWith('data:video/')) {
      const res = await saveBase64File(data, prefix);
      return res.url;
    }
    return data;
  }
  if (Array.isArray(data)) {
    const arr = [];
    for (let i = 0; i < data.length; i++) {
      arr.push(await extractAndPersistBase64Images(data[i], `${prefix}_${i}`));
    }
    return arr;
  }
  if (typeof data === 'object') {
    const copy: any = {};
    for (const [key, val] of Object.entries(data)) {
      copy[key] = await extractAndPersistBase64Images(val, `${prefix}_${key}`);
    }
    return copy;
  }
  return data;
};

// Helper to determine accurate MIME type
const getMimeType = (filename: string, fallback = 'image/jpeg'): string => {
  const lower = filename.toLowerCase();
  if (lower.endsWith('.mp4')) return 'video/mp4';
  if (lower.endsWith('.webm')) return 'video/webm';
  if (lower.endsWith('.mov')) return 'video/quicktime';
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.webp')) return 'image/webp';
  if (lower.endsWith('.gif')) return 'image/gif';
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
  return fallback;
};

// Serve uploaded files: check disk cache first, recover from MongoDB Atlas if Render restarted
app.get('/uploads/:filename', async (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(uploadsDir, filename);
  const mimeType = getMimeType(filename);

  // 1. Serve immediately from disk if available
  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Accept-Ranges', 'bytes');
    return res.sendFile(filePath);
  }

  // 2. Recover from MongoDB Atlas if disk was wiped
  if (isMongoConnected()) {
    try {
      const doc = await ImageModel.findOne({ id: filename });
      if (doc && doc.data) {
        const buffer = Buffer.from(doc.data, 'base64');
        try { fs.writeFileSync(filePath, buffer); } catch (_) {}
        res.setHeader('Content-Type', doc.contentType || mimeType);
        res.setHeader('Accept-Ranges', 'bytes');
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        return res.send(buffer);
      }
    } catch (err) {
      console.error('Error recovering file from Mongo:', err);
    }
  }

  return res.status(404).send('Archivo no encontrado');
});

// Fallback static uploads serving
app.use('/uploads', express.static(uploadsDir));

// Healthcheck endpoint for Render
app.get('/api/health', (_req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'H2derm Official Store API',
    mongo: getMongoStatus()
  });
});

// MongoDB connection status & retry endpoints
app.get('/api/mongo/status', async (_req, res) => {
  const status = getMongoStatus();
  let imageCount = 0;
  if (status.connected) {
    try {
      imageCount = await ImageModel.countDocuments();
    } catch (_) {}
  }
  res.json({ ...status, imageCount });
});

app.post('/api/mongo/retry', async (_req, res) => {
  const connected = await connectMongoDB();
  res.json({ success: connected, ...getMongoStatus() });
});

// High-speed binary upload endpoint for reels & videos (no base64 inflation)
app.post('/api/upload-video-binary', express.raw({ type: '*/*', limit: '80mb' }), async (req, res) => {
  try {
    const rawBuffer = req.body;
    if (!rawBuffer || !Buffer.isBuffer(rawBuffer) || rawBuffer.length === 0) {
      return res.status(400).json({ error: 'Archivo de video vacío o no recibido' });
    }

    const filename = `reel_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.mp4`;
    const filePath = path.join(uploadsDir, filename);
    fs.writeFileSync(filePath, rawBuffer);

    // If within BSON limit (under 14MB), also persist to MongoDB Atlas
    if (isMongoConnected() && rawBuffer.length < 14 * 1024 * 1024) {
      try {
        await ImageModel.findOneAndUpdate(
          { id: filename },
          {
            id: filename,
            data: rawBuffer.toString('base64'),
            contentType: 'video/mp4',
            filename,
            sizeKb: Math.round(rawBuffer.length / 1024),
            createdAt: new Date()
          },
          { upsert: true }
        );
      } catch (mongoErr) {
        console.warn('Large video stored on disk, skipped Mongo Atlas cache:', mongoErr);
      }
    }

    res.json({
      success: true,
      url: `/uploads/${filename}`,
      fileUrl: `/uploads/${filename}`,
      filename,
      sizeKb: Math.round(rawBuffer.length / 1024),
      mongo: isMongoConnected() && rawBuffer.length < 14 * 1024 * 1024
    });
  } catch (err: any) {
    console.error('Binary video upload error:', err);
    res.status(500).json({ error: 'Error procesando archivo de video', details: err.message });
  }
});

// Upload endpoint
app.post('/api/upload', async (req, res) => {
  try {
    const { image, prefix } = req.body;
    if (!image) {
      return res.status(400).json({ error: 'Falta la imagen' });
    }
    const result = await saveBase64File(image, prefix || 'upload');
    res.json({ 
      success: true, 
      url: result.url, 
      fileUrl: result.url,
      filename: result.filename,
      mongo: isMongoConnected() 
    });
  } catch (err: any) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Error procesando la imagen', details: err.message });
  }
});

// Store Content endpoints
const contentFile = path.join(dataDir, 'content.json');
const defaultContentFile = path.resolve(__dirname, 'src', 'data', 'defaultContent.json');

app.get('/api/store/content', async (_req, res) => {
  try {
    if (isMongoConnected()) {
      const doc = await StoreConfigModel.findOne({ key: 'content' });
      if (doc && doc.data) {
        return res.json(doc.data);
      }
    }
  } catch (err) {
    console.error('Mongo read content error:', err);
  }

  if (fs.existsSync(contentFile)) {
    const content = readJsonFile(contentFile, null);
    if (content) return res.json(content);
  }
  if (fs.existsSync(defaultContentFile)) {
    const content = readJsonFile(defaultContentFile, null);
    if (content) return res.json(content);
  }
  res.status(404).json({ error: 'No custom content saved yet' });
});

app.post('/api/store/content', async (req, res) => {
  try {
    // Process and persist any Base64 images directly into MongoDB & uploads
    const cleanContent = await extractAndPersistBase64Images(req.body, 'content');
    
    writeJsonFile(contentFile, cleanContent);
    writeJsonFile(defaultContentFile, cleanContent);

    if (isMongoConnected()) {
      await StoreConfigModel.findOneAndUpdate(
        { key: 'content' },
        { key: 'content', data: cleanContent, updatedAt: new Date() },
        { upsert: true }
      );
    }

    res.json({ success: true, content: cleanContent, mongo: isMongoConnected() });
  } catch (err: any) {
    console.error('Error saving content:', err);
    res.status(500).json({ error: 'Error guardando contenido', details: err.message });
  }
});

// Store Media Carousel endpoints
const mediaFile = path.join(dataDir, 'media.json');
const defaultMediaFile = path.resolve(__dirname, 'src', 'data', 'defaultMedia.json');

app.get('/api/store/media', async (_req, res) => {
  try {
    if (isMongoConnected()) {
      const doc = await StoreConfigModel.findOne({ key: 'media' });
      if (doc && doc.data && Array.isArray(doc.data) && doc.data.length > 0) {
        return res.json(doc.data);
      }
    }
  } catch (err) {
    console.error('Mongo read media error:', err);
  }

  if (fs.existsSync(mediaFile)) {
    const media = readJsonFile(mediaFile, null);
    if (media) return res.json(media);
  }
  if (fs.existsSync(defaultMediaFile)) {
    const media = readJsonFile(defaultMediaFile, null);
    if (media) return res.json(media);
  }
  res.status(404).json({ error: 'No custom media saved yet' });
});

app.post('/api/store/media', async (req, res) => {
  try {
    // Process and persist any Base64 images directly into MongoDB & uploads
    const cleanMedia = await extractAndPersistBase64Images(req.body, 'carousel');
    
    writeJsonFile(mediaFile, cleanMedia);
    writeJsonFile(defaultMediaFile, cleanMedia);

    if (isMongoConnected()) {
      await StoreConfigModel.findOneAndUpdate(
        { key: 'media' },
        { key: 'media', data: cleanMedia, updatedAt: new Date() },
        { upsert: true }
      );
    }

    res.json({ success: true, media: cleanMedia, mongo: isMongoConnected() });
  } catch (err: any) {
    console.error('Error saving media:', err);
    res.status(500).json({ error: 'Error guardando media', details: err.message });
  }
});

// Synchronize all defaults permanently for Render deploy and MongoDB
app.post('/api/store/save-defaults', async (req, res) => {
  try {
    let { content, media, gateways } = req.body;
    
    if (content) {
      content = await extractAndPersistBase64Images(content, 'content');
      writeJsonFile(contentFile, content);
      writeJsonFile(defaultContentFile, content);
    }
    if (media) {
      media = await extractAndPersistBase64Images(media, 'carousel');
      writeJsonFile(mediaFile, media);
      writeJsonFile(defaultMediaFile, media);
    }
    if (gateways) {
      writeJsonFile(gatewaysFile, gateways);
    }

    if (isMongoConnected()) {
      if (content) {
        await StoreConfigModel.findOneAndUpdate(
          { key: 'content' },
          { key: 'content', data: content, updatedAt: new Date() },
          { upsert: true }
        );
      }
      if (media) {
        await StoreConfigModel.findOneAndUpdate(
          { key: 'media' },
          { key: 'media', data: media, updatedAt: new Date() },
          { upsert: true }
        );
      }
      if (gateways) {
        await StoreConfigModel.findOneAndUpdate(
          { key: 'gateways' },
          { key: 'gateways', data: gateways, updatedAt: new Date() },
          { upsert: true }
        );
      }
    }

    res.json({ 
      success: true, 
      content,
      media,
      gateways,
      message: isMongoConnected() 
        ? '¡Guardado con éxito en MongoDB Atlas y en archivos del servidor!' 
        : '¡Guardado en los archivos del servidor! (Conecta MongoDB para que nunca se borre en Render)',
      mongo: isMongoConnected()
    });
  } catch (err: any) {
    console.error('Error saving defaults:', err);
    res.status(500).json({ error: 'Error al sincronizar datos', details: err.message });
  }
});

// Payment Gateways settings endpoints
const gatewaysFile = path.join(dataDir, 'gateways.json');
app.get('/api/store/gateways', async (_req, res) => {
  try {
    if (isMongoConnected()) {
      const doc = await StoreConfigModel.findOne({ key: 'gateways' });
      if (doc && doc.data) {
        return res.json(doc.data);
      }
    }
  } catch (err) {
    console.error('Mongo read gateways error:', err);
  }

  if (fs.existsSync(gatewaysFile)) {
    const gateways = readJsonFile(gatewaysFile, null);
    if (gateways) return res.json(gateways);
  }
  res.status(404).json({ error: 'No custom gateways saved yet' });
});

app.post('/api/store/gateways', async (req, res) => {
  try {
    writeJsonFile(gatewaysFile, req.body);
    if (isMongoConnected()) {
      await StoreConfigModel.findOneAndUpdate(
        { key: 'gateways' },
        { key: 'gateways', data: req.body, updatedAt: new Date() },
        { upsert: true }
      );
    }
    res.json({ success: true, gateways: req.body, mongo: isMongoConnected() });
  } catch (err: any) {
    console.error('Error saving gateways:', err);
    res.status(500).json({ error: 'Error guardando pasarelas', details: err.message });
  }
});

// Orders endpoints
const ordersFile = path.join(dataDir, 'orders.json');
app.get('/api/store/orders', async (_req, res) => {
  try {
    if (isMongoConnected()) {
      const mongoOrders = await OrderModel.find().sort({ createdAt: -1 });
      if (mongoOrders && mongoOrders.length > 0) {
        return res.json(mongoOrders);
      }
    }
  } catch (err) {
    console.error('Mongo read orders error:', err);
  }

  const orders = readJsonFile(ordersFile, []);
  res.json(orders);
});

app.post('/api/store/orders', async (req, res) => {
  try {
    const orders = readJsonFile<any[]>(ordersFile, []);
    const newOrder = req.body;
    const existingIndex = orders.findIndex(o => o.id === newOrder.id || o.trackingCode === newOrder.trackingCode);
    if (existingIndex >= 0) {
      orders[existingIndex] = { ...orders[existingIndex], ...newOrder, updatedAt: new Date().toISOString() };
    } else {
      orders.unshift({ ...newOrder, createdAt: newOrder.createdAt || new Date().toISOString() });
    }
    writeJsonFile(ordersFile, orders);

    if (isMongoConnected()) {
      await OrderModel.findOneAndUpdate(
        { id: newOrder.id },
        { ...newOrder, updatedAt: new Date() },
        { upsert: true }
      );
    }

    res.json({ success: true, order: newOrder, mongo: isMongoConnected() });
  } catch (err: any) {
    console.error('Error saving order:', err);
    res.status(500).json({ error: 'Error guardando pedido', details: err.message });
  }
});

// Reviews endpoints
const reviewsFile = path.join(dataDir, 'reviews.json');
app.get('/api/store/reviews', async (_req, res) => {
  try {
    if (isMongoConnected()) {
      const doc = await StoreConfigModel.findOne({ key: 'reviews' });
      if (doc && doc.data) {
        return res.json(doc.data);
      }
    }
  } catch (err) {
    console.error('Mongo read reviews error:', err);
  }

  if (fs.existsSync(reviewsFile)) {
    const reviews = readJsonFile(reviewsFile, null);
    if (reviews) return res.json(reviews);
  }
  res.status(404).json({ error: 'No custom reviews saved yet' });
});

app.post('/api/store/reviews', async (req, res) => {
  try {
    writeJsonFile(reviewsFile, req.body);
    if (isMongoConnected()) {
      await StoreConfigModel.findOneAndUpdate(
        { key: 'reviews' },
        { key: 'reviews', data: req.body, updatedAt: new Date() },
        { upsert: true }
      );
    }
    res.json({ success: true, reviews: req.body, mongo: isMongoConnected() });
  } catch (err: any) {
    console.error('Error saving reviews:', err);
    res.status(500).json({ error: 'Error guardando reseñas', details: err.message });
  }
});

// MERCADO PAGO: Checkout Pro Preference Endpoint
app.post('/api/mercadopago/create-preference', async (req, res) => {
  try {
    const { items, payer, orderId, backUrls, autoReturn, packId } = req.body;

    const gateways = readJsonFile<any>(gatewaysFile, {
      mercadoPago: {
        enabled: true,
        mode: 'production',
        accessToken: '',
        directPaymentLink: '',
        packLinks: {}
      }
    });

    const mpConfig: any = gateways?.mercadoPago || {};

    if (packId && mpConfig.packLinks && mpConfig.packLinks[packId]) {
      const directUrl = mpConfig.packLinks[packId];
      if (directUrl && directUrl.startsWith('http')) {
        return res.json({
          init_point: directUrl,
          sandbox_init_point: directUrl,
          type: 'direct_link'
        });
      }
    }

    if (mpConfig.directPaymentLink && mpConfig.directPaymentLink.startsWith('http')) {
      return res.json({
        init_point: mpConfig.directPaymentLink,
        sandbox_init_point: mpConfig.directPaymentLink,
        type: 'direct_link'
      });
    }

    const accessToken = mpConfig.accessToken || process.env.MERCADO_PAGO_ACCESS_TOKEN || '';

    if (!accessToken || accessToken.includes('YOUR_ACCESS_TOKEN') || accessToken.length < 15) {
      return res.status(400).json({
        error: 'missing_credentials',
        message: 'No se ha configurado un Access Token válido de Mercado Pago ni links de pago en el Panel de Administración (#admin).'
      });
    }

    const preferenceData: any = {
      items: items.map((it: any) => ({
        id: it.id || 'item-1',
        title: it.title || 'H2derm Kit Rostro',
        unit_price: Number(it.unit_price) || 0,
        quantity: Number(it.quantity) || 1,
        currency_id: it.currency_id || 'ARS'
      })),
      external_reference: orderId,
      statement_descriptor: 'H2DERM OFICIAL'
    };

    if (payer && payer.email && !payer.email.includes('placeholder') && !payer.email.includes('test@example')) {
      preferenceData.payer = {
        name: payer.name || undefined,
        email: payer.email,
        phone: payer.phone ? { number: payer.phone } : undefined,
        address: payer.address ? { street_name: payer.address } : undefined
      };
    }

    if (backUrls) {
      preferenceData.back_urls = backUrls;
      preferenceData.auto_return = autoReturn || 'approved';
    }

    const mpResponse = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify(preferenceData)
    });

    const data = await mpResponse.json();

    if (!mpResponse.ok) {
      console.error('Mercado Pago API error:', data);
      return res.status(mpResponse.status).json({
        error: 'mp_api_error',
        message: data.message || 'Error al comunicarse con Mercado Pago.',
        details: data
      });
    }

    res.json({
      id: data.id,
      init_point: data.init_point,
      sandbox_init_point: data.sandbox_init_point
    });
  } catch (err: any) {
    console.error('Error creating MP preference:', err);
    res.status(500).json({
      error: 'server_error',
      message: 'Ocurrió un error inesperado al generar el checkout de Mercado Pago.',
      details: err.message
    });
  }
});

// Serve frontend: Vite in development, static dist in production
const distPath = path.resolve(__dirname, 'dist');
const indexPath = path.join(distPath, 'index.html');
const isDev = process.env.NODE_ENV !== 'production';

if (isDev) {
  // Mount Vite middlewares in development
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true, host: '0.0.0.0' },
    appType: 'spa'
  });
  app.use(vite.middlewares);
} else {
  // Production mode: Serve built static files
  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
  }
  app.get('*', (_req, res) => {
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send('Not found. Please run npm run build.');
    }
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 H2derm store server is running on port ${PORT}`);
  console.log(`🌍 Health check available at: http://localhost:${PORT}/api/health`);
});
