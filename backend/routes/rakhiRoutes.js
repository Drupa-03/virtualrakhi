// const express = require('express');
// const router = express.Router();
// const db = require('../db');
// const { v4: uuidv4 } = require('uuid');

// // POST: Generate Rakhi Link
// router.post('/generate', (req, res) => {
//   const { from_name, to_name } = req.body;
//   if (!from_name || !to_name) return res.status(400).json({ error: 'Both names required' });

//   const link_id = uuidv4().slice(0, 8);

//   const q = 'INSERT INTO rakhi_links (link_id, from_name, to_name) VALUES (?, ?, ?)';
//   db.query(q, [link_id, from_name, to_name], (err) => {
//     if (err) return res.status(500).json({ error: err });
//     res.json({ link: `/view?from=${from_name}&to=${to_name}&id=${link_id}` });
//   });
// });

// // GET: Fetch Details by Link ID
// router.get('/view/:link_id', (req, res) => {
//   const { link_id } = req.params;
//   const q = 'SELECT from_name, to_name FROM rakhi_links WHERE link_id = ?';
//   db.query(q, [link_id], (err, results) => {
//     if (err) return res.status(500).json({ error: err });
//     if (results.length === 0) return res.status(404).json({ error: 'Not found' });
//     res.json(results[0]);
//   });
// });

// module.exports = router;

//backend-rakhiRotes.js
// const express = require('express');
// const router = express.Router();
// const db = require('../db');
// const { v4: uuidv4 } = require('uuid');
// const multer = require('multer');
// const path = require('path');

// // Configure Multer storage
// const storage = multer.diskStorage({
//   destination: path.join(__dirname, '..', 'public', 'uploads', 'rakhis'),
//   filename: (req, file, callback) => {
//     callback(null, `${uuidv4()}.png`);
//   }
// });

// // Initialize Multer with storage configuration
// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
// });

// // POST: Generate Rakhi Link
// router.post('/generate', (req, res) => {
//   const { from_name, to_name } = req.body;
//   if (!from_name || !to_name) return res.status(400).json({ error: 'Both names required' });

//   const link_id = uuidv4().slice(0, 8);

//   const q = 'INSERT INTO rakhi_links (link_id, from_name, to_name) VALUES (?, ?, ?)';
//   db.query(q, [link_id, from_name, to_name], (err) => {
//     if (err) return res.status(500).json({ error: err });
//     res.json({ link: `/view?from=${from_name}&to=${to_name}&id=${link_id}` });
//   });
// });

// // GET: Fetch Details by Link ID
// router.get('/view/:link_id', (req, res) => {
//   const { link_id } = req.params;
//   const q = 'SELECT from_name, to_name, image_path FROM rakhi_links WHERE link_id = ?';
//   db.query(q, [link_id], (err, results) => {
//     if (err) return res.status(500).json({ error: err });
//     if (results.length === 0) return res.status(404).json({ error: 'Not found' });
//     res.json(results[0]);
//   });
// });

// // POST: Upload Captured Image
// router.post('/upload/:link_id', upload.single('image'), (req, res) => {
//   const { link_id } = req.params;
//   const imagePath = req.file ? `/uploads/rakhis/${req.file.filename}` : null;

//   if (!imagePath) {
//     return res.status(400).json({ error: 'No image provided' });
//   }

//   const q = 'UPDATE rakhi_links SET image_path = ? WHERE link_id = ?';
//   db.query(q, [imagePath, link_id], (err) => {
//     if (err) return res.status(500).json({ error: err });
//     res.json({ message: 'Image uploaded successfully', imagePath });
//   });
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const db = require('../db');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure the uploads/rakhis directory exists
const uploadDir = path.join(__dirname, '..', 'public', 'uploads', 'rakhis');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer storage
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, callback) => {
    callback(null, `${uuidv4()}.png`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// POST: Generate Rakhi Link
router.post('/generate', (req, res) => {
  const { from_name, to_name } = req.body;
  if (!from_name || !to_name) return res.status(400).json({ error: 'Both names required' });

  const link_id = uuidv4().slice(0, 8);

  const q = 'INSERT INTO rakhi_links (link_id, from_name, to_name) VALUES (?, ?, ?)';
  db.query(q, [link_id, from_name, to_name], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ link: `/view?from=${from_name}&to=${to_name}&id=${link_id}` });
  });
});

// GET: Fetch Details by Link ID
router.get('/view/:link_id', (req, res) => {
  const { link_id } = req.params;
  const q = 'SELECT from_name, to_name, image_path FROM rakhi_links WHERE link_id = ?';
  db.query(q, [link_id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(404).json({ error: 'Not found' });
    const result = results[0];
    if (result.image_path) {
      result.image_path = `http://localhost:3002${result.image_path}`; // Prepend backend URL
    }
    res.json(result);
  });
});

// POST: Upload Captured Image
router.post('/upload/:link_id', upload.single('image'), (req, res) => {
  const { link_id } = req.params;
  const imagePath = req.file ? `/uploads/rakhis/${req.file.filename}` : null;

  if (!imagePath) {
    return res.status(400).json({ error: 'No image provided' });
  }

  console.log('File saved at:', path.join(__dirname, '..', 'public', imagePath)); // Log file path
  const q = 'UPDATE rakhi_links SET image_path = ? WHERE link_id = ?';
  db.query(q, [imagePath, link_id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Image uploaded successfully', imagePath });
  });
});

module.exports = router;