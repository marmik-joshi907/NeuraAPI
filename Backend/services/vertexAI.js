import { VertexAI } from '@google-cloud/vertexai';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' }); 

// Initialize the Vertex AI client
const vertexAI = new VertexAI({
  project: process.env.GOOGLE_PROJECT_ID, 
  location: 'us-central1',
});

// Get the generative model
const generativeModel = vertexAI.getGenerativeModel({
  model: 'gemini-pro',
});

// Check if embedding model is available
let embeddingModel = null;

// Check if a method for embedding models exists
try {
  embeddingModel = vertexAI.getModel ? vertexAI.getModel('textembedding-gecko@003') : null;
} catch (error) {
  console.error('Error initializing embedding model:', error);
}

// If the embedding model is available, define the getEmbeddings function
const getEmbeddings = async (texts) => {
  if (!embeddingModel) {
    console.log('Embedding model not available or method changed');
    return [];
  }

  try {
    const embeddings = await embeddingModel.getEmbeddings(texts);
    return embeddings.map((embedding) => embedding.values);
  } catch (error) {
    console.error('Error getting embeddings:', error);
    return [];
  }
};

// Generate code using the generative model
export const generateCode = async (prompt) => {
  try {
    const response = await generativeModel.generateContent(prompt);
    return response.response.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error generating code:', error);
    return '';
  }
};

// Analyze code for security vulnerabilities
export const analyzeVulnerability = async (code) => {
  const prompt = `Analyze this API implementation for security vulnerabilities:\n\n${code}\n\nReport:`;
  try {
    const response = await generativeModel.generateContent(prompt);
    return response.response.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error analyzing vulnerability:', error);
    return 'Error occurred while analyzing vulnerability';
  }
};

// Now, only the necessary exports
export { getEmbeddings };
