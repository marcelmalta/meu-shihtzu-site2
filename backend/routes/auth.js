const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) return res.status(400).json({ msg: 'Preencha name, email e password.' });
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ msg: 'Usuário já existe.' });
  const user = await User.create({ name, email, password });
  res.status(201).json({ token: sign(user._id), user: { id: user._id, name: user.name, email: user.email } });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ msg: 'Informe email e password.' });
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) return res.status(400).json({ msg: 'Credenciais inválidas.' });
  res.json({ token: sign(user._id), user: { id: user._id, name: user.name, email: user.email } });
});

module.exports = router;
