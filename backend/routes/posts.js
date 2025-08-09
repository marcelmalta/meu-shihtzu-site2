const express = require('express');
const Pet = require('../models/Pet');                 // <-- corrige caminho
const auth = require('../middleware/authMiddleware'); // <-- corrige caminho
const router = express.Router();

// Listar posts do pet
router.get('/:petId', auth, async (req, res) => {
  const { petId } = req.params;
  const pet = await Pet.findOne({ _id: petId, owner: req.user.id });
  if (!pet) return res.status(404).json({ msg: 'Pet não encontrado' });
  res.json(pet.posts || []);
});

// Criar post
router.post('/:petId', auth, async (req, res) => {
  const { petId } = req.params;
  const { type, media, caption } = req.body;
  const pet = await Pet.findOne({ _id: petId, owner: req.user.id });
  if (!pet) return res.status(404).json({ msg: 'Pet não encontrado' });

  const post = {
    _id: String(Date.now()), // gera um id simples para o front mapear
    type: type || 'image',
    media: media || '',
    caption: caption || '',
    likes: 0,
    comments: 0,
    createdAt: new Date().toISOString(),
  };

  pet.posts.unshift(post); // adiciona no topo
  await pet.save();
  res.status(201).json(post);
});

// (Opcional) Curtir post
router.post('/:petId/:index/like', auth, async (req, res) => {
  const { petId, index } = req.params;
  const pet = await Pet.findOne({ _id: petId, owner: req.user.id });
  if (!pet || !pet.posts[index]) return res.status(404).json({ msg: 'Post não encontrado' });
  pet.posts[index].likes = (pet.posts[index].likes || 0) + 1;
  await pet.save();
  res.json(pet.posts[index]);
});

module.exports = router;
