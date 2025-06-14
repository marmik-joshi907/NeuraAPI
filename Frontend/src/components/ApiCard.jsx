import React, { useState } from 'react';
import { Card, CardContent, Typography, Button, Chip, Collapse, Divider } from '@mui/material';
import CodeGenerator from './CodeGenerator';

const ApiCard = ({ api }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <Card className="card h-full flex flex-col">
      <CardContent className="flex-grow">
        <div className="flex justify-between items-start mb-3">
          <Typography variant="h6" className="font-bold">
            {api.name}
          </Typography>
          <Chip 
            label={`Security: ${api.securityScore}/10`} 
            color={api.securityScore > 7 ? 'success' : api.securityScore > 5 ? 'warning' : 'error'} 
            size="small"
          />
        </div>
        
        <Typography variant="body2" color="textSecondary" className="mb-3">
          {api.description}
        </Typography>
        
        <div className="flex flex-wrap gap-2 mb-3">
          <Chip label={api.category} variant="outlined" size="small" />
          {api.freeTier && <Chip label="Free Tier" color="success" size="small" />}
          <Chip label={api.auth} variant="outlined" size="small" />
        </div>
        
        <Typography variant="caption" className="block text-gray-500 mb-3">
          {api.baseURL}
        </Typography>
        
        <Button 
          size="small" 
          onClick={() => setExpanded(!expanded)}
          className="mt-2"
        >
          {expanded ? 'Hide Code Generator' : 'Generate Client Code'}
        </Button>
      </CardContent>
      
      <Collapse in={expanded} unmountOnExit>
        <Divider />
        <CardContent>
          <CodeGenerator apiId={api._id} />
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default ApiCard;