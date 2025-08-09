// backend/routes/upload.js
const express = require('express');
const crypto = require('crypto');
const multer = require('multer');
const router = express.Router();

const requireAuth = require('../middleware/authMiddleware'); // <-- corrige caminho
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

/**
 * ENVs (Render):
 *  - S3_BUCKET=shihtizuz-media
 *  - S3_REGION=auto                           // R2 usa "auto"
 *  - S3_ENDPOINT=https://<ACCOUNT_ID>.r2.cloudflarestorage.com
 *  - S3_ACCESS_KEY_ID=...
 *  - S3_SECRET_ACCESS_KEY=...
 *  - S3_PUBLIC_BASE_URL=https://<seu_subdominio>.r2.dev  // domínio público/CDN
 */

const s3 = new S3Client({
  region: process.env.S3_REGION || 'auto',
  endpoint: process.env.S3_ENDPOINT, // obrigatório no R2
  forcePathStyle: true,               // recomendado para R2
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
});

// ----- Config de upload (multer em memória) -----
const allowed = new Set([
  // imagens
  'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif',
  // vídeos
  'video/mp4', 'video/webm', 'video/ogg',
]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
  fileFilter: (_req, file, cb) => {
    if (allowed.has(file.mimetype)) return cb(null, true);
    cb(new Error('Tipo de arquivo não permitido'));
  },
});

// helper para extensão
function extFrom(file) {
  const name = file.originalname || '';
  const byDot = name.includes('.') ? name.split('.').pop() : '';
  const fromName = (byDot || '').toLowerCase();
  if (fromName) return fromName;

  const map = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'video/mp4': 'mp4',
    'video/webm': 'webm',
    'video/ogg': 'ogg',
  };
  return map[file.mimetype] || 'bin';
}

// POST /api/upload  (multipart/form-data; campo "file")
router.post('/', requireAuth, upload.single('file'), async (req, res) => {
  try {
    if (!process.env.S3_BUCKET) {
      return res.status(500).json({ message: 'S3_BUCKET não configurado' });
    }
    if (!process.env.S3_PUBLIC_BASE_URL) {
      return res.status(500).json({ message: 'S3_PUBLIC_BASE_URL não configurado' });
    }

    const file = req.file;
    if (!file) return res.status(400).json({ message: 'Arquivo obrigatório' });

    const userId = req.user?.id || 'anon';
    const petId = (req.body?.petId || 'no-pet').toString().trim();
    const ext = extFrom(file);
    const rand = crypto.randomBytes(6).toString('hex');

    // chave organizada por user/pet/data
    const key = `uploads/${userId}/${petId}/${Date.now()}-${rand}.${ext}`;

    await s3.send(new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    }));

    const base = process.env.S3_PUBLIC_BASE_URL.replace(/\/+$/, '');
    const url = `${base}/${key}`;

    return res.json({
      url,
      filename: key,
      mimetype: file.mimetype,
      size: file.size,
    });
  } catch (err) {
    console.error('[upload] erro:', err);
    const msg = err?.message === 'Tipo de arquivo não permitido' ? err.message : 'Falha no upload';
    return res.status(500).json({ message: msg });
  }
});

module.exports = router;
