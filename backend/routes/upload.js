// backend/routes/upload.js
const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const router = express.Router();

const requireAuth = require('../middleware/auth'); // ajuste o caminho se for diferente

// Garante a pasta /uploads
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configuração do multer
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const base = path.basename(file.originalname, ext).replace(/\s+/g, '_');
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${base}-${unique}${ext}`);
  },
});

const allowed = new Set([
  // imagens
  'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif',
  // vídeos (opcional)
  'video/mp4', 'video/webm', 'video/ogg',
]);

function fileFilter(_req, file, cb) {
  if (allowed.has(file.mimetype)) return cb(null, true);
  cb(new Error('Tipo de arquivo não permitido'));
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
});

// POST /api/upload  (multipart/form-data, campo 'file')
router.post('/', requireAuth, upload.single('file'), (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ message: 'Arquivo obrigatório' });

  // URL pública (Render ou local)
  const publicUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
  return res.json({
    url: publicUrl,
    filename: file.filename,
    mimetype: file.mimetype,
    size: file.size,
  });
});

module.exports = router;
