import mongoose from 'mongoose';
import config from 'config';
import log from './logger';

/**
+ * Connects to the MongoDB database using the provided URI.
+ * @throws {Error} If there is an error connecting to the database.
+ */
const connectToDb = async () => {
    const dbURI = config.get<string>('dbURI');
    try {
        await mongoose.connect(dbURI);
        log.info('Connected to MongoDB');
    } catch (error) {
        log.error('Error connecting to MongoDB', error);
        process.exit(1);
    }

    mongoose.connection.on('error', (err) => {
        log.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
        log.warn('MongoDB connection disconnected');
    });
};

export default connectToDb;
