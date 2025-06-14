import dotenv from 'dotenv';
dotenv.config({ path: '../.env' }); 
console.log('MONGO_URI:', process.env.MONGO_URI); // Debugging step

import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import apiRoutes from './routes/apiRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api', apiRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
