// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

/* =========================
   CORS (front Render + local)
   ========================= */
const clean = (u) => (u || '').replace(/\/+$/, '');
const FRONTEND = clean(process.env.FRONTEND_URL) || 'http://localhost:5173';

const allowedOrigins = new Set([
  FRONTEND,                 // Render (sem barra no final)
  'http://localhost:3000',  // CRA (se usar)
  'http://localhost:5173',  // Vite
]);

const corsOptions = {
  origin(origin, cb) {
    // Permite ferramentas sem origin (Postman/CLI) e health checks
    if (!origin) return cb(null, true);
    if (allowedOrigins.has(origin)) return cb(null, true);
    return cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
};

app.use(cors(corsOptions));
// pré-flight explícito (alguns proxies exigem)
app.options('*', cors(corsOptions));

/* =========================
   Body parsers
   ========================= */
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

/* =========================
   Healthcheck
   ========================= */
app.get('/health', (_req, res) => res.send('ok'));

/* =========================
   Arquivos estáticos (uploads locais, útil em dev)
   ========================= */
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/* =========================
   Rotas da API
   ========================= */
app.use('/api/auth', require('./routes/auth'));
app.use('/api/pets', require('./routes/pets'));
app.use('/api/posts', require('./routes/posts'));
// Upload para R2/S3 (usa @aws-sdk/client-s3 + multer em memória)
app.use('/api/upload', require('./routes/upload'));

/* =========================
   Conexão ao MongoDB
   ========================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB conectado'))
  .catch((err) => console.error('Erro MongoDB:', err));

/* =========================
   Tratamento de erros
   ========================= */
app.use((err, req, res, next) => {
  // CORS
  if (err && err.message === 'Not allowed by CORS') {
    return res.status(403).json({ msg: 'Origem não permitida pelo CORS', origin: req.headers.origin });
  }

  // JSON inválido
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({ message: 'JSON inválido' });
  }

  // Multer (upload) — tamanho/tipo
  if (err?.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ message: 'Arquivo excede o limite permitido' });
  }
  if (err?.message === 'Tipo de arquivo não permitido') {
    return res.status(400).json({ message: err.message });
  }

  // Fallback
  console.error('[ERROR]', err);
  return res.status(500).json({ message: 'Erro interno do servidor' });
});

/* =========================
   Start
   ========================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
