const express = require('express');
const Pet = require('../models/Pet');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

// Meus pets (lista para seleção)
router.get('/my-pets', auth, async (req, res) => {
  const pets = await Pet.find({ owner: req.user.id }).sort({ name: 1 });
  res.json(pets);
});

// Criar pet
router.post('/create', auth, async (req, res) => {
  const { name, bio, avatar } = req.body;
  if (!name) return res.status(400).json({ msg: 'Nome é obrigatório' });
  const pet = await Pet.create({
    owner: req.user.id,
    name,
    bio: bio || '',
    avatar: avatar || '',
    album: [],
    posts: [],
    lastNameEdit: new Date().toISOString().slice(0, 10),
  });
  res.status(201).json(pet);
});

// Atualizar pet (nome/bio/avatar)
router.put('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const pet = await Pet.findOne({ _id: id, owner: req.user.id });
  if (!pet) return res.status(404).json({ msg: 'Pet não encontrado' });

  const { name, bio, avatar } = req.body;
  if (name && name !== pet.name) {
    // regra simples de edição de nome (15 dias) — opcional
    const last = new Date(pet.lastNameEdit);
    const now = new Date();
    const diff = Math.floor((now - last) / (1000 * 60 * 60 * 24));
    if (diff < 15) return res.status(400).json({ msg: `Nome só pode ser alterado em ${15 - diff} dia(s)` });
    pet.lastNameEdit = now.toISOString().slice(0, 10);
    pet.name = name;
  }
  if (typeof bio === 'string') pet.bio = bio;
  if (typeof avatar === 'string') pet.avatar = avatar;

  await pet.save();
  res.json(pet);
});

// Apagar pet
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const deleted = await Pet.findOneAndDelete({ _id: id, owner: req.user.id });
  if (!deleted) return res.status(404).json({ msg: 'Pet não encontrado' });
  res.json({ ok: true });
});

module.exports = router;
