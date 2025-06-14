import { PredictionServiceClient } from '@google-cloud/aiplatform';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

// === Vertex AI Initialization ===
const client = new PredictionServiceClient();

// === Embedding Model Setup ===
const model = 'textembedding-gecko@003'; // Replace with your desired model

// === Get Embeddings ===
export const getEmbeddings = async (texts) => {
  if (!Array.isArray(texts) || texts.length === 0) {
    console.warn('⚠️ getEmbeddings called with empty input');
    return [];
  }

  try {
    const endpoint = `projects/${process.env.GOOGLE_PROJECT_ID}/locations/us-central1/publishers/google/models/${model}`;
    const instances = texts.map(text => ({ content: text }));
    const parameters = { outputDimensionality: 512 }; // Adjust as needed

    const request = {
      endpoint,
      instances,
      parameters,
    };

    const [response] = await client.predict(request);
    const embeddings = response.predictions.map(p => p.embedding.values);
    return embeddings;
  } catch (error) {
    console.error('❌ Error fetching embeddings:', error.message);
    return texts.map(() => []);
  }
};

// === Generate Code ===
export const generateCode = async (prompt) => {
  try {
    const response = await client.generateText({
      model: 'gemini-pro',
      prompt,
    });
    return response.text;
  } catch (error) {
    console.error('❌ Error generating code:', error.message);
    return '';
  }
};

// === Analyze Vulnerability ===
export const analyzeVulnerability = async (code) => {
  const prompt = `Analyze this API implementation for security vulnerabilities:\n\n${code}\n\nReport:`;

  try {
    const response = await client.generateText({
      model: 'gemini-pro',
      prompt,
    });
    return response.text;
  } catch (error) {
    console.error('❌ Error analyzing vulnerability:', error.message);
    return 'Error occurred while analyzing vulnerability';
  }
};
