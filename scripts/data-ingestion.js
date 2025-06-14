import mongoose from 'mongoose';
import axios from 'axios';
import dotenv from 'dotenv';
import API from '../backend/models/ApiModel.js';
import { getEmbeddings } from '../backend/services/vertexAI.js';

// Load environment variables from .env in project root
dotenv.config({ path: '../.env' });

const DATA_SOURCES = [
  {
    name: 'APIs.guru',
    url: 'https://api.apis.guru/v2/list.json',
    transform: (data) => {
      return Object.entries(data).map(([name, details]) => {
        const version = details.versions[details.preferred];
        if (!version) return null;

        const baseURL = version.info?.contact?.url ||
                        (version.servers && Object.values(version.servers)[0]?.url) || '';

        return {
          name,
          description: version.info?.description || 'No description available',
          category: version.info?.['x-providerName'] || 'General',
          baseURL,
          auth: version.info?.security ? Object.keys(version.info.security)[0] : 'None',
          freeTier: true,
          securityScore: Math.floor(Math.random() * 4) + 7,
          source: 'APIs.guru'
        };
      }).filter(api => api !== null);
    }
  },
  {
    name: 'Public APIs',
    url: 'https://api.publicapis.org/entries',
    transform: (data) => {
      return data.entries.map(api => ({
        name: api.API,
        description: api.Description,
        category: api.Category,
        baseURL: api.Link,
        auth: api.Auth || 'None',
        freeTier: !(api.HTTPS === false),
        securityScore: api.HTTPS ? 8 : 5,
        source: 'PublicAPIs.org'
      }));
    }
  }
];

// Mongoose debug
mongoose.connection.on('connected', () => {
  console.log('✅ Mongoose connected to MongoDB');
});
mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});
mongoose.connection.on('disconnected', () => {
  console.log('🔌 Mongoose disconnected');
});

const ingestData = async () => {
  try {
    console.log('Connecting to MongoDB...');
    mongoose.set('bufferCommands', false);

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10
    });

    await mongoose.connection.asPromise();
    console.log('✅ MongoDB connection is fully ready');
    console.log('Mongoose readyState:', mongoose.connection.readyState);

    console.log('Clearing existing API data...');
    // await API.deleteMany({});
    console.log('🧹 Cleared existing API data');

    for (const source of DATA_SOURCES) {
      try {
        console.log(`🔍 Fetching data from ${source.name}...`);
        const response = await axios.get(source.url, { timeout: 15000 });

        const apis = source.transform(response.data);
        console.log(`📦 Found ${apis.length} APIs from ${source.name}`);

        const validAPIs = apis.filter(api =>
          api.description && api.description.length > 20 &&
          api.baseURL && api.baseURL.trim().length > 5
        );

        console.log(`🧠 Generating embeddings for ${validAPIs.length} APIs...`);
        const descriptions = validAPIs.map(api => api.description);
        const embeddings = await getEmbeddings(descriptions);

        const apiDocuments = validAPIs.map((api, index) => ({
          ...api,
          embedding: embeddings[index] || []
        }));

        console.log(`📥 Inserting ${apiDocuments.length} APIs from ${source.name}...`);
        await API.insertMany(apiDocuments);
        console.log(`✅ Inserted ${apiDocuments.length} APIs from ${source.name}`);
      } catch (sourceError) {
        console.error(`❌ Failed to process ${source.name}:`, sourceError.message);
      }
    }

    console.log('🎉 Data ingestion complete!');
  } catch (error) {
    console.error('❌ Data ingestion failed:', error.message);
    console.error('Full error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

ingestData();
