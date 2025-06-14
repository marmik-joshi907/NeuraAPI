import mongoose from 'mongoose';
import axios from 'axios';
import dotenv from 'dotenv';
import API from '../backend/models/ApiModel.js';
import { getEmbeddings } from '../backend/services/vertexAI.js';

dotenv.config({ path: '../.env' }); 

// Sample API data sources
const DATA_SOURCES = [
  {
    name: 'APIs.guru',
    url: 'https://api.apis.guru/v2/list.json',
    transform: (data) => {
      return Object.entries(data).map(([name, details]) => ({
        name,
        description: details.versions[details.preferred]?.info.description || 'No description',
        category: details.versions[details.preferred]?.info?.x-providerName || 'General',
        baseURL: details.versions[details.preferred]?.info.contact?.url || '',
        auth: 'API Key',
        freeTier: true,
        securityScore: Math.floor(Math.random() * 4) + 7, // 7-10
        source: 'APIs.guru'
      }));
    }
  },
  // Additional data sources would be added here
];

const ingestData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    for (const source of DATA_SOURCES) {
      console.log(`Ingesting data from ${source.name}...`);
      const response = await axios.get(source.url);
      const apis = source.transform(response.data);
      
      // Get descriptions for embeddings
      const descriptions = apis.map(api => api.description);
      const embeddings = await getEmbeddings(descriptions);
      
      // Add embeddings to API objects
      const apiDocuments = apis.map((api, index) => ({
        ...api,
        embedding: embeddings[index]
      }));
      
      // Insert into database
      await API.insertMany(apiDocuments);
      console.log(`Inserted ${apiDocuments.length} APIs from ${source.name}`);
    }
    
    console.log('Data ingestion complete!');
    process.exit(0);
  } catch (error) {
    console.error('Data ingestion failed:', error);
    process.exit(1);
  }
};

ingestData();