// server.js
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const app = express();

/* ---------------------------
   Configs básicas / helpers
----------------------------*/
const clean = (u) => (u || '').replace(/\/+$/, '');
const FRONTEND_URL = clean(process.env.FRONTEND_URL) || 'http://localhost:5173';
const PORT = process.env.PORT || 5000;

const isProd = process.env.NODE_ENV === 'production';

// em Render/Heroku etc. precisa para cookies `secure: true`
app.set('trust proxy', 1);

/* -----------
   C O R S
----------- */
const allowedOrigins = new Set([
  FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000',
]);

const corsConfig = {
  origin(origin, cb) {
    // permitir tools locais/healthcheck sem origin
    if (!origin) return cb(null, true);
    if (allowedOrigins.has(origin)) return cb(null, true);
    return cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsConfig));
// Preflight
app.options('*', cors(corsConfig));

/* -------------------------
   Body parsers + estáticos
-------------------------- */
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/* -------------------------
   Sessão (opcional, mas pronto)
   - necessário se o login usar cookie de sessão
-------------------------- */
if (process.env.SESSION_SECRET && process.env.MONGO_URI) {
  app.use(
    session({
      name: 'sid',
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        ttl: 60 * 60 * 24 * 7, // 7 dias
      }),
      cookie: {
        httpOnly: true,
        sameSite: 'none',                // permite cookie cross-site
        secure: isProd,                  // true em produção (HTTPS no Render)
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 dias
      },
    })
  );
}

/* ------------
   Healthcheck
------------- */
app.get('/health', (_req, res) => res.status(200).send('ok'));

/* ----------
   Rotas API
----------- */
app.use('/api/auth', require('./routes/auth'));
app.use('/api/pets', require('./routes/pets'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/upload', require('./routes/upload'));

/* ---------------
   Conexão Mongo
---------------- */
mongoose
  .connect(process.env.MONGO_URI, {
    dbName: process.env.MONGO_DB || undefined,
  })
  .then(() => console.log('MongoDB conectado'))
  .catch((err) => console.error('Erro MongoDB:', err));

/* ----------------
   Handler de erros
----------------- */
app.use((err, req, res, _next) => {
  if (err && err.message === 'Not allowed by CORS') {
    return res
      .status(403)
      .json({ message: 'Origem não permitida pelo CORS', origin: req.headers.origin });
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

/* ------
   Start
------- */
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log('FRONTEND_URL permitido:', FRONTEND_URL);
});
