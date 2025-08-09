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
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'http://localhost:3000',
  'http://localhost:5173',
];

const corsOptions = {
  origin(origin, cb) {
    // Permite ferramentas sem origin (Postman/CLI)
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '1mb' }));

/* =========================
   Healthcheck
   ========================= */
app.get('/health', (_req, res) => res.send('ok'));

/* =========================
   Arquivos estáticos (uploads)
   ========================= */
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/* =========================
   Rotas da API
   ========================= */
app.use('/api/auth', require('./routes/auth'));
app.use('/api/pets', require('./routes/pets'));
app.use('/api/posts', require('./routes/posts'));

/* =========================
   Conexão ao MongoDB
   ========================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB conectado'))
  .catch((err) => console.error('Erro MongoDB:', err));

/* =========================
   Tratamento simples de erros (inclui CORS)
   ========================= */
app.use((err, req, res, next) => {
  if (err && err.message === 'Not allowed by CORS') {
    return res.status(403).json({ msg: 'Origem não permitida pelo CORS', origin: req.headers.origin });
  }
  next(err);
});

/* =========================
   Start
   ========================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
