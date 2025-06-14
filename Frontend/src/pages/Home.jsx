import React, { useState } from 'react';
import { Container, TextField, Button, Grid, CircularProgress, Paper, Typography } from '@mui/material';
import ApiCard from '../components/ApiCard';

const Home = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xl" className="py-8">
      <div className="text-center mb-12">
        <Typography variant="h3" className="font-bold mb-4 text-[var(--primary)]">
          Discover & Secure APIs
        </Typography>
        <Typography variant="subtitle1" className="text-gray-600 max-w-2xl mx-auto">
          AI-powered API discovery with security auditing and code generation
        </Typography>
      </div>
      
      <div className="flex gap-4 mb-12">
        <TextField
          fullWidth
          variant="outlined"
          label="Search APIs (e.g. 'weather APIs with free tier')"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button 
          variant="contained" 
          color="primary"
          onClick={handleSearch}
          className="btn-primary min-w-[120px]"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Search'}
        </Button>
      </div>
      
      {results.length > 0 ? (
        <Grid container spacing={4}>
          {results.map((api) => (
            <Grid item xs={12} md={6} lg={4} key={api._id}>
              <ApiCard api={api} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <div className="text-center py-12">
          <Typography variant="h6" className="text-gray-500">
            Search for APIs to get started
          </Typography>
        </div>
      )}
    </Container>
  );
};

export default Home;