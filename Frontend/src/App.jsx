import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import VulnerabilityScanner from './pages/VulnerabilityScanner';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Typography } from '@mui/material';  // <-- Add this import

const theme = createTheme({
  palette: {
    primary: {
      main: '#4361ee',
    },
    secondary: {
      main: '#3f37c9',
    },
    background: {
      default: '#f8f9fa',
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/vulnerability" element={<VulnerabilityScanner />} />
            </Routes>
          </main>
          <footer className="bg-white py-6 border-t">
            <Container maxWidth="xl">
              <Typography variant="body2" color="textSecondary" align="center">
                © {new Date().getFullYear()} API Genius - Intelligent API Discovery & Security
              </Typography>
            </Container>
          </footer>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
