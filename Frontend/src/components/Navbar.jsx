import React from 'react';
import { Link } from 'react-router-dom';
import { Button, AppBar, Toolbar, Typography, Container } from '@mui/material';

const Navbar = () => {
  return (
    <AppBar position="static" className="bg-[var(--primary)] shadow-none">
      <Container maxWidth="xl">
        <Toolbar className="flex justify-between">
          <div className="flex items-center">
            <Typography variant="h6" className="font-bold text-white">
              API Genius
            </Typography>
          </div>
          
          <div className="flex gap-4">
            <Button color="inherit" component={Link} to="/">
              Home
            </Button>
            <Button color="inherit" component={Link} to="/vulnerability">
              Security Scan
            </Button>
          </div>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;