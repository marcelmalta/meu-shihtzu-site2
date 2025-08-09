const express = require('express');
const crypto = require('crypto');
const multer = require('multer');
const router = express.Router();

const requireAuth = require('../middleware/auth');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const s3 = new S3Client({
  region: process.env.S3_REGION || 'auto',
  endpoint: process.env.S3_ENDPOINT,
  forcePathStyle: true,
  credentials: { accessKeyId: process.env.S3_ACCESS_KEY_ID, secretAccessKey: process.env.S3_SECRET_ACCESS_KEY },
});

const allowed = new Set(['image/jpeg','image/jpg','image/png','image/webp','image/gif','video/mp4','video/webm','video/ogg']);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => allowed.has(file.mimetype) ? cb(null, true) : cb(new Error('Tipo de arquivo não permitido')),
});

function extFrom(file) {
  const n = (file.originalname || '').split('.'); const e = (n.length>1 ? n.pop() : '').toLowerCase();
  if (e) return e;
  const map = {'image/jpeg':'jpg','image/jpg':'jpg','image/png':'png','image/webp':'webp','image/gif':'gif','video/mp4':'mp4','video/webm':'webm','video/ogg':'ogg'};
  return map[file.mimetype] || 'bin';
}

router.post('/', requireAuth, upload.single('file'), async (req, res) => {
  try {
    if (!process.env.S3_BUCKET) return res.status(500).json({ message: 'S3_BUCKET não configurado' });
    if (!process.env.S3_PUBLIC_BASE_URL) return res.status(500).json({ message: 'S3_PUBLIC_BASE_URL não configurado' });
    if (!req.file) return res.status(400).json({ message: 'Arquivo obrigatório' });

    const userId = req.user?.id || 'anon';
    const petId = (req.body?.petId || 'no-pet').toString().trim();
    const key = `uploads/${userId}/${petId}/${Date.now()}-${crypto.randomBytes(6).toString('hex')}.${extFrom(req.file)}`;

    await s3.send(new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    }));

    const base = process.env.S3_PUBLIC_BASE_URL.replace(/\/+$/, '');
    res.json({ url: `${base}/${key}`, filename: key, mimetype: req.file.mimetype, size: req.file.size });
  } catch (err) {
    console.error('[upload] erro:', err);
    res.status(500).json({ message: err?.message === 'Tipo de arquivo não permitido' ? err.message : 'Falha no upload' });
  }
});

module.exports = router;
