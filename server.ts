import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Ensure directories exist
const dataDir = path.resolve(__dirname, 'data');
const uploadsDir = path.resolve(__dirname, 'uploads');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// Body parsing with generous limit for images
app.use(express.json({ limit: '60mb' }));
app.use(express.urlencoded({ limit: '60mb', extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(uploadsDir));

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

// Helper: Save Base64 string to an image file in uploads
const saveBase64File = (base64String: string, prefix = 'img'): string => {
  if (!base64String || typeof base64String !== 'string') return base64String;
  if (!base64String.startsWith('data:')) return base64String;

  const matches = base64String.match(/^data:([A-Za-z0-9-+/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) return base64String;

  const mimeType = matches[1];
  const base64Data = matches[2];
  let ext = 'jpg';
  if (mimeType.includes('png')) ext = 'png';
  else if (mimeType.includes('webp')) ext = 'webp';
  else if (mimeType.includes('gif')) ext = 'gif';
  else if (mimeType.includes('mp4')) ext = 'mp4';
  else if (mimeType.includes('webm')) ext = 'webm';

  const filename = `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${ext}`;
  const filePath = path.join(uploadsDir, filename);

  try {
    fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));
    return `/uploads/${filename}`;
  } catch (err) {
    console.error('Error saving uploaded file:', err);
    return base64String;
  }
};

// Healthcheck endpoint for Render
app.get('/api/health', (_req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'H2derm Official Store API'
  });
});

// Upload endpoint: accepts raw base64 and returns permanent URL (self-contained base64 preserves universal rendering)
app.post('/api/upload', (req, res) => {
  try {
    const { image, prefix } = req.body;
    if (!image) {
      return res.status(400).json({ error: 'Falta la imagen' });
    }
    // Also backup to disk if possible
    const fileUrl = saveBase64File(image, prefix || 'upload');
    // Return the image data URL directly to guarantee 100% universal rendering on Render and all devices without broken links
    res.json({ success: true, url: image, fileUrl });
  } catch (err: any) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Error procesando la imagen', details: err.message });
  }
});

// Store Content endpoints
const contentFile = path.join(dataDir, 'content.json');
const defaultContentFile = path.resolve(__dirname, 'src', 'data', 'defaultContent.json');

app.get('/api/store/content', (_req, res) => {
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

app.post('/api/store/content', (req, res) => {
  try {
    const content = req.body;
    writeJsonFile(contentFile, content);
    writeJsonFile(defaultContentFile, content);
    res.json({ success: true, content });
  } catch (err: any) {
    console.error('Error saving content:', err);
    res.status(500).json({ error: 'Error guardando contenido', details: err.message });
  }
});

// Store Media Carousel endpoints
const mediaFile = path.join(dataDir, 'media.json');
const defaultMediaFile = path.resolve(__dirname, 'src', 'data', 'defaultMedia.json');

app.get('/api/store/media', (_req, res) => {
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

app.post('/api/store/media', (req, res) => {
  try {
    const media = req.body;
    writeJsonFile(mediaFile, media);
    writeJsonFile(defaultMediaFile, media);
    res.json({ success: true, media });
  } catch (err: any) {
    console.error('Error saving media:', err);
    res.status(500).json({ error: 'Error guardando media', details: err.message });
  }
});

// Synchronize all defaults permanently for Render deploy
app.post('/api/store/save-defaults', (req, res) => {
  try {
    const { content, media, gateways } = req.body;
    if (content) {
      writeJsonFile(contentFile, content);
      writeJsonFile(defaultContentFile, content);
    }
    if (media) {
      writeJsonFile(mediaFile, media);
      writeJsonFile(defaultMediaFile, media);
    }
    if (gateways) {
      writeJsonFile(gatewaysFile, gateways);
    }
    res.json({ success: true, message: 'Defaults saved to project files and data store' });
  } catch (err: any) {
    console.error('Error saving defaults:', err);
    res.status(500).json({ error: 'Error al sincronizar datos', details: err.message });
  }
});

// Payment Gateways settings endpoints
const gatewaysFile = path.join(dataDir, 'gateways.json');
app.get('/api/store/gateways', (_req, res) => {
  if (fs.existsSync(gatewaysFile)) {
    const gateways = readJsonFile(gatewaysFile, null);
    if (gateways) return res.json(gateways);
  }
  res.status(404).json({ error: 'No custom gateways saved yet' });
});

app.post('/api/store/gateways', (req, res) => {
  try {
    writeJsonFile(gatewaysFile, req.body);
    res.json({ success: true, gateways: req.body });
  } catch (err: any) {
    console.error('Error saving gateways:', err);
    res.status(500).json({ error: 'Error guardando pasarelas', details: err.message });
  }
});

// Orders endpoints
const ordersFile = path.join(dataDir, 'orders.json');
app.get('/api/store/orders', (_req, res) => {
  const orders = readJsonFile(ordersFile, []);
  res.json(orders);
});

app.post('/api/store/orders', (req, res) => {
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
    res.json({ success: true, order: newOrder });
  } catch (err: any) {
    console.error('Error saving order:', err);
    res.status(500).json({ error: 'Error guardando pedido', details: err.message });
  }
});

// Reviews endpoints
const reviewsFile = path.join(dataDir, 'reviews.json');
app.get('/api/store/reviews', (_req, res) => {
  if (fs.existsSync(reviewsFile)) {
    const reviews = readJsonFile(reviewsFile, null);
    if (reviews) return res.json(reviews);
  }
  res.status(404).json({ error: 'No custom reviews saved yet' });
});

app.post('/api/store/reviews', (req, res) => {
  try {
    writeJsonFile(reviewsFile, req.body);
    res.json({ success: true, reviews: req.body });
  } catch (err: any) {
    console.error('Error saving reviews:', err);
    res.status(500).json({ error: 'Error guardando reseñas', details: err.message });
  }
});

// MERCADO PAGO: Checkout Pro Preference Endpoint
// Redirects customer directly to the official Mercado Pago portal for payment with account balance (dinero en cuenta), debit, or credit
app.post('/api/mercadopago/create-preference', async (req, res) => {
  try {
    const { 
      packId,
      packTitle, 
      unitPrice, 
      quantity = 1, 
      orderId, 
      payer = {},
      returnUrl
    } = req.body;

    const gateways = readJsonFile<any>(gatewaysFile, {});
    const mpConfig = gateways.mercadoPago || {};
    
    // 1. Check pack-specific direct payment links (e.g. mpago.la/xxxx configured for pack-1, pack-2, or pack-3)
    if (packId && mpConfig.packLinks && mpConfig.packLinks[packId] && mpConfig.packLinks[packId].trim().startsWith('http')) {
      return res.json({
        success: true,
        init_point: mpConfig.packLinks[packId].trim(),
        mode: 'pack_direct_link'
      });
    }

    // 2. Check general direct payment link (e.g. mpago.la/xxxx)
    if (mpConfig.directPaymentLink && mpConfig.directPaymentLink.trim().startsWith('http')) {
      return res.json({
        success: true,
        init_point: mpConfig.directPaymentLink.trim(),
        mode: 'direct_link'
      });
    }

    const accessToken = (process.env.MP_ACCESS_TOKEN || mpConfig.accessToken || '').trim();

    // If access token is empty or dummy placeholder
    if (!accessToken || !accessToken.startsWith('APP_USR-') || accessToken.includes('92840192')) {
      return res.status(400).json({
        success: false,
        error: 'missing_credentials',
        message: 'No se ha configurado el Link de Pago (mpago.la) ni el Access Token de Mercado Pago en el Panel de Administración (#admin ➔ Pasarelas).'
      });
    }

    // Determine host for callback URLs
    const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
    const host = req.get('host') || 'localhost:3000';
    const baseUrl = returnUrl || `${protocol}://${host}`;

    // Clean buyer email: DO NOT send a dummy email so Mercado Pago does not lock out customer wallet login
    const validBuyerEmail = payer.email && payer.email.includes('@') && !payer.email.includes('cliente.h2derm.com')
      ? payer.email.trim()
      : undefined;

    const preferenceBody: any = {
      items: [
        {
          id: orderId || `H2D-${Date.now()}`,
          title: packTitle || 'H2derm Kit Rostro Profesional',
          description: 'Tratamiento Facial Dermocosmético H2derm Oficial',
          quantity: Number(quantity) || 1,
          unit_price: Number(unitPrice) || 0,
          currency_id: 'ARS'
        }
      ],
      back_urls: {
        success: `${baseUrl}/?payment_status=approved&order_id=${orderId || ''}`,
        failure: `${baseUrl}/?payment_status=failure&order_id=${orderId || ''}`,
        pending: `${baseUrl}/?payment_status=pending&order_id=${orderId || ''}`
      },
      auto_return: 'approved',
      statement_descriptor: 'H2DERM',
      external_reference: orderId || `ORD-${Date.now()}`,
      payment_methods: {
        installments: mpConfig.maxInstallments || 6
      }
    };

    // If buyer entered a valid email or name, pass it to help pre-fill on Mercado Pago, but without locking to a fake guest email
    if (validBuyerEmail || payer.name) {
      preferenceBody.payer = {
        name: payer.name || undefined,
        email: validBuyerEmail,
        phone: payer.phone ? {
          number: String(payer.phone).replace(/\D/g, '')
        } : undefined,
        address: payer.street ? {
          street_name: payer.street || 'Dirección',
          street_number: Number(payer.number) || 0,
          zip_code: payer.zipCode || '1000'
        } : undefined
      };
    }

    const mpResponse = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(preferenceBody)
    });

    const mpData = await mpResponse.json();

    if (!mpResponse.ok || !mpData.init_point) {
      console.error('Mercado Pago API error:', mpData);
      return res.status(400).json({
        success: false,
        error: 'mp_api_error',
        message: mpData.message || 'Error al comunicarse con Mercado Pago.',
        details: mpData
      });
    }

    // In sandbox mode use sandbox_init_point if available, else init_point
    const redirectUrl = (mpConfig.mode === 'sandbox' && mpData.sandbox_init_point) 
      ? mpData.sandbox_init_point 
      : mpData.init_point;

    res.json({
      success: true,
      init_point: redirectUrl,
      preferenceId: mpData.id,
      sandbox: mpConfig.mode === 'sandbox'
    });
  } catch (err: any) {
    console.error('Mercado Pago preference creation failed:', err);
    res.status(500).json({
      success: false,
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
