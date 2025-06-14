import React, { useState } from 'react';
import { TextField, Button, MenuItem, Box, CircularProgress, Paper, Typography } from '@mui/material';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const CodeGenerator = ({ apiId }) => {
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  
  const languages = [
    { value: 'python', label: 'Python' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'java', label: 'Java' },
    { value: 'go', label: 'Go' },
    { value: 'ruby', label: 'Ruby' },
  ];

  const generateCode = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/generate-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiId, language })
      });
      
      const data = await response.json();
      setCode(data.code);
    } catch (error) {
      console.error('Code generation error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <Typography variant="subtitle1" className="font-medium mb-2">
        Generate Client Code
      </Typography>
      
      <Box className="flex items-center gap-3 mb-4">
        <TextField
          select
          label="Language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          variant="outlined"
          size="small"
          className="w-40"
        >
          {languages.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        
        <Button 
          variant="contained" 
          onClick={generateCode}
          disabled={loading}
          className="btn-primary"
        >
          {loading ? <CircularProgress size={24} /> : 'Generate'}
        </Button>
      </Box>
      
      {code && (
        <Paper elevation={0} className="rounded-lg overflow-hidden">
          <SyntaxHighlighter 
            language={language} 
            style={atomOneDark}
            customStyle={{ margin: 0, borderRadius: '0.5rem' }}
          >
            {code}
          </SyntaxHighlighter>
        </Paper>
      )}
    </div>
  );
};

export default CodeGenerator;