import API from '../models/ApiModel.js';
import { getEmbeddings, generateCode, analyzeVulnerability } from '../services/vertexAI.js';

export const vectorSearch = async (req, res) => {
  try {
    const { query } = req.body;
    const queryEmbedding = (await getEmbeddings([query]))[0];
    
    const results = await API.aggregate([
      {
        $vectorSearch: {
          index: "api_vector_index",
          path: "embedding",
          queryVector: queryEmbedding,
          numCandidates: 100,
          limit: 10
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          category: 1,
          baseURL: 1,
          auth: 1,
          freeTier: 1,
          securityScore: 1,
          score: { $meta: "vectorSearchScore" }
        }
      }
    ]);
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const generateClientCode = async (req, res) => {
  try {
    const { apiId, language } = req.body;
    const api = await API.findById(apiId);
    
    if (!api) {
      return res.status(404).json({ error: 'API not found' });
    }
    
    const prompt = `Generate secure ${language} client code for ${api.name} API (${api.baseURL}) using ${api.auth} authentication with best security practices.`;
    const code = await generateCode(prompt);
    
    res.json({ code });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const scanVulnerability = async (req, res) => {
  try {
    const { code } = req.body;
    const report = await analyzeVulnerability(code);
    res.json({ report });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};