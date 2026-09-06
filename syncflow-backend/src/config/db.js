import dns from 'dns';
import mongoose from 'mongoose';

// Force Node.js to use Google public DNS to bypass ISP network blocks
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            family: 4 // Forces IPv4 to prevent connection timeouts
        });
        console.log(`MongoDB Connected Successfully: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Database Connection Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;