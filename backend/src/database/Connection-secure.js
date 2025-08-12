import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

class Connection {
    constructor() {
        this.connect();
    }

    async connect() {
        try {
            // Add connection options for better error handling and stability
            const options = {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                maxPoolSize: 10,
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
            };

            await mongoose.connect(process.env.DB_URL, options);
            console.log("✅ Database connected successfully");

            // Handle connection events
            mongoose.connection.on('error', (err) => {
                console.error('❌ Database connection error:', err);
            });

            mongoose.connection.on('disconnected', () => {
                console.warn('⚠️ Database disconnected');
            });

            mongoose.connection.on('reconnected', () => {
                console.log('✅ Database reconnected');
            });

        } catch (err) {
            console.error('❌ Error connecting to database:', err.message);
            console.error('Stack trace:', err.stack);
            
            // Graceful shutdown on connection failure
            process.exit(1);
        }
    }

    async disconnect() {
        try {
            await mongoose.disconnect();
            console.log('✅ Database disconnected gracefully');
        } catch (err) {
            console.error('❌ Error disconnecting from database:', err);
        }
    }

    getConnectionStatus() {
        return mongoose.connection.readyState;
    }
}

export default Connection;
