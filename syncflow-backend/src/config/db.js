import dns from 'dns';
import mongoose from 'mongoose';

try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {}

const connectDB = async () => {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/syncflow';
    try {
        const conn = await mongoose.connect(uri, {
            family: 4,
            serverSelectionTimeoutMS: 5000
        });
        console.log(`🍃 MongoDB Connected Successfully: ${conn.connection.host}`);
    } catch (error) {
        console.warn(`⚠️ MongoDB Connection Error (${error.message}). Running in lightweight memory mode for authentication & sockets.`);
    }
};

export default connectDB;