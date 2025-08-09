const express = require('express');
const Pet = require('../models/Pet');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/my-pets', auth, async (req, res) => {
  const pets = await Pet.find({ owner: req.user.id }).sort({ name: 1 });
  res.json(pets);
});

router.post('/create', auth, async (req, res) => {
  const { name, bio, avatar } = req.body || {};
  if (!name) return res.status(400).json({ msg: 'Nome é obrigatório' });
  const pet = await Pet.create({ owner: req.user.id, name, bio: bio || '', avatar: avatar || '' });
  res.status(201).json(pet);
});

router.get('/:id', auth, async (req, res) => {
  const pet = await Pet.findOne({ _id: req.params.id, owner: req.user.id });
  if (!pet) return res.status(404).json({ msg: 'Pet não encontrado' });
  res.json(pet);
});

router.put('/:id', auth, async (req, res) => {
  const pet = await Pet.findOne({ _id: req.params.id, owner: req.user.id });
  if (!pet) return res.status(404).json({ msg: 'Pet não encontrado' });
  const { name, bio, avatar } = req.body || {};
  if (typeof name === 'string' && name !== pet.name) {
    const last = new Date(pet.lastNameEdit);
    const now = new Date();
    const diff = Math.floor((now - last) / (1000 * 60 * 60 * 24));
    if (diff < 15) return res.status(400).json({ msg: `Nome só pode ser alterado em ${15 - diff} dia(s)` });
    pet.name = name; pet.lastNameEdit = now.toISOString().slice(0,10);
  }
  if (typeof bio === 'string') pet.bio = bio;
  if (typeof avatar === 'string') pet.avatar = avatar;
  await pet.save();
  res.json(pet);
});

router.delete('/:id', auth, async (req, res) => {
  const deleted = await Pet.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
  if (!deleted) return res.status(404).json({ msg: 'Pet não encontrado' });
  res.json({ ok: true });
});

module.exports = router;
