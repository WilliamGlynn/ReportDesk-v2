import express from 'express';
import multer from 'multer';
import { importData } from '../controllers/importControl.js';

export const router = express.Router(); //create a router object

const upload = multer({ dest: 'uploads/' }); //create foler to store uploaded files in ide

router.get('/', (req, res) => {
  res.render("Import.ejs");
});

router.post('/', upload.single('file'), importData); // Handle file upload