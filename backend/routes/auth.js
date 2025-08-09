const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ msg: 'Preencha name, email e password.' });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ msg: 'Usuário já existe.' });

    const user = await User.create({ name, email, password });
    const token = signToken(user._id);

    return res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error('REGISTER ERROR:', err);
    return res.status(500).json({ msg: 'Erro no cadastro.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ msg: 'Informe email e password.' });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(400).json({ msg: 'Credenciais inválidas.' });
    }

    const token = signToken(user._id);
    return res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error('LOGIN ERROR:', err);
    return res.status(500).json({ msg: 'Erro no login.' });
  }
});

module.exports = router;
