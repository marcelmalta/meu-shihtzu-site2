require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// CORS
const clean = (u) => (u || '').replace(/\/+$/, '');
const FRONTEND = clean(process.env.FRONTEND_URL) || 'http://localhost:5173';
const allowedOrigins = new Set([FRONTEND, 'http://localhost:3000', 'http://localhost:5173']);

app.use(cors({
  origin(origin, cb) {
    if (!origin) return cb(null, true);
    if (allowedOrigins.has(origin)) return cb(null, true);
    return cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET','HEAD','PUT','PATCH','POST','DELETE','OPTIONS'],
}));
app.options('*', cors());

// Body
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// Health
app.get('/health', (_req, res) => res.send('ok'));

// Static (dev)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

import cors from "cors"; // ou const cors = require("cors");

const FRONTEND_URL = process.env.FRONTEND_URL || "https://SEU-FRONT.onrender.com";

app.set("trust proxy", 1); // necessário no Render p/ cookies secure

app.use(
  cors({
    origin: FRONTEND_URL, // só aceita requisições do seu front
    credentials: true,    // permite enviar cookies/autenticação
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Rotas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/pets', require('./routes/pets'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/upload', require('./routes/upload'));

// Mongo
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB conectado'))
  .catch((err) => console.error('Erro MongoDB:', err));

// Errors
app.use((err, req, res, next) => {
  if (err && err.message === 'Not allowed by CORS') {
    return res.status(403).json({ msg: 'Origem não permitida pelo CORS', origin: req.headers.origin });
  }
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({ message: 'JSON inválido' });
  }
  if (err?.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ message: 'Arquivo excede o limite permitido' });
  }
  if (err?.message === 'Tipo de arquivo não permitido') {
    return res.status(400).json({ message: err.message });
  }
  console.error('[ERROR]', err);
  return res.status(500).json({ message: 'Erro interno do servidor' });
});

// Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
