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
  FRONTEND,                // ex.: https://seu-front.onrender.com
  'http://localhost:3000', // CRA
  'http://localhost:5173', // Vite
]);

const corsOptions = {
  origin(origin, cb) {
    if (!origin) return cb(null, true);          // Postman/CLI/health
    if (allowedOrigins.has(origin)) return cb(null, true);
    return cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET','HEAD','PUT','PATCH','POST','DELETE','OPTIONS'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // pré-flight

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
   Arquivos estáticos (dev)
   ========================= */
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/* =========================================================
   MONTAGEM DE ROTAS COM LOG (ajuda a descobrir path inválido)
   NÃO use URL absoluta (https://...) como path de rota!
   ========================================================= */
function safeMount(mountPath, routerPath) {
  try {
    const r = require(routerPath);
    app.use(mountPath, r);
    console.log(`[OK] Mounted ${routerPath} at ${mountPath}`);
  } catch (e) {
    console.error(`[ERR] Failed while mounting ${routerPath} at ${mountPath}`);
    console.error(e);
    process.exit(1); // encerra para ficar claro qual arquivo quebrou
  }
}

// IMPORTANTE: sempre paths relativos aqui:
safeMount('/api/auth', './routes/auth');
safeMount('/api/pets', './routes/pets');
safeMount('/api/posts', './routes/posts');
safeMount('/api/upload', './routes/upload');

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

/* =========================
   Start
   ========================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
