import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || "";

let isConnected = false;

export const connectMongoDB = async () => {
    if (!MONGODB_URI) {
        return false;
    }
    if (isConnected) return true;

    try {
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 5000,
        });
        isConnected = true;
        console.log("🍃 Conectado exitosamente a MongoDB Atlas / Database!");
        return true;
    } catch (err: any) {
        console.warn(
            "⚠️ No se pudo conectar a MongoDB, usando almacenamiento JSON local:",
            err.message,
        );
        isConnected = false;
        return false;
    }
};

export const isMongoConnected = () => isConnected;

// Schema for General Store Settings & Content
const StoreConfigSchema = new mongoose.Schema(
    {
        key: { type: String, required: true, unique: true },
        data: { type: mongoose.Schema.Types.Mixed, required: true },
        updatedAt: { type: Date, default: Date.now },
    },
    { strict: false },
);

export const StoreConfigModel =
    mongoose.models.StoreConfig ||
    mongoose.model("StoreConfig", StoreConfigSchema);

// Schema for Orders
const OrderSchema = new mongoose.Schema(
    {
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
        status: { type: String, default: "pending" },
        trackingCode: String,
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    { strict: false },
);

export const OrderModel =
    mongoose.models.Order || mongoose.model("Order", OrderSchema);
