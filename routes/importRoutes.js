import express from 'express';
import multer from 'multer';
import { importData } from '../controllers/importControl.js';

export const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('file'), importData);

