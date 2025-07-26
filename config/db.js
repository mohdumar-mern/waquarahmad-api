import mongoose from 'mongoose'

export const connectDB = async() =>{
    try {
        mongoose.connect(process.env.MONGO_URI)
        console.log('Database connected')
    } catch (error) {
          console.error('MongoDB connection error:', error);
    process.exit(1);
    }
}