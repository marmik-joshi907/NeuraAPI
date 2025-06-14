import express from 'express';
import {
  vectorSearch,
  generateClientCode,
  scanVulnerability
} from '../controllers/apiControllers.js';

const router = express.Router();

router.post('/search', vectorSearch);
router.post('/generate-code', generateClientCode);
router.post('/scan', scanVulnerability);

export default router;