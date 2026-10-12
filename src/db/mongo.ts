import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Ensure dotenv is loaded immediately
dotenv.config();

let isConnected = false;
let lastConnectionError: string | null = null;

export const getMongoUri = (): string => {
    const rawUri =
        process.env.MONGODB_URI ||
        process.env.MONGO_URI ||
        process.env.MONGODB_URL ||
        process.env.MONGO_URL ||
        process.env.DATABASE_URL ||
        '';
    // Strip optional surrounding quotes if copied from .env
    return rawUri.trim().replace(/^["']|["']$/g, '');
};

export const connectMongoDB = async (): Promise<boolean> => {
    const uri = getMongoUri();
    if (!uri) {
        lastConnectionError = 'No se encontró MONGODB_URI o MONGO_URI en las variables de entorno';
        return false;
    }
    if (isConnected && mongoose.connection.readyState === 1) {
        return true;
    }

    try {
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 6000,
            connectTimeoutMS: 6000,
        });
        isConnected = true;
        lastConnectionError = null;
        console.log('🍃 Conectado exitosamente a MongoDB Atlas / Database!');
        return true;
    } catch (err: any) {
        lastConnectionError = err.message || 'Error de conexión a MongoDB';
        console.warn('⚠️ No se pudo conectar a MongoDB:', lastConnectionError);
        isConnected = false;
        return false;
    }
};

export const isMongoConnected = (): boolean => {
    return isConnected && mongoose.connection.readyState === 1;
};

export const getMongoStatus = () => {
    const uri = getMongoUri();
    return {
        connected: isMongoConnected(),
        uriConfigured: Boolean(uri && uri.length > 5),
        maskedUri: uri ? uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@') : null,
        lastError: lastConnectionError
    };
};

// Schema for General Store Settings & Content
const StoreConfigSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
    updatedAt: { type: Date, default: Date.now }
}, { strict: false });

export const StoreConfigModel = mongoose.models.StoreConfig || mongoose.model('StoreConfig', StoreConfigSchema);

// Schema for Stored Images (Persistent images even on Render ephemeral containers!)
const StoredImageSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true }, // filename, e.g. carousel_171283921_abc.jpg
    data: { type: String, required: true }, // Base64 payload
    contentType: { type: String, default: 'image/jpeg' },
    filename: String,
    sizeKb: Number,
    createdAt: { type: Date, default: Date.now }
}, { strict: false });

export const ImageModel = mongoose.models.StoredImage || mongoose.model('StoredImage', StoredImageSchema);

// Schema for Orders
const OrderSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    customerName: String,
    customerEmail: String,
    customerPhone: String,
    customerAddress: String,
    customerCity: String,
    customerProvince: String,
    customerZip: String,
    customerNotes: String,
    packId: String,
    packTitle: String,
    packQuantity: Number,
    totalAmount: Number,
    paymentMethod: String,
    status: { type: String, default: 'pending' },
    trackingCode: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { strict: false });

export const OrderModel = mongoose.models.Order || mongoose.model('Order', OrderSchema);
