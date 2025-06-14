import mongoose from 'mongoose';

const apiSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  baseURL: { type: String, required: true },
  auth: { type: String, enum: ['OAuth', 'API Key', 'None'], default: 'None' },
  freeTier: { type: Boolean, default: false },
  popularity: { type: Number, default: 0 },
  securityScore: { type: Number, min: 0, max: 10, default: 7 },
  embedding: { type: [Number], required: true },
  source: { type: String, enum: ['APIs.guru', 'ProgrammableWeb', 'GovData'], required: true }
}, { timestamps: true });

export default mongoose.model('API', apiSchema);