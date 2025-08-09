const express = require('express');
const Pet = require('../models/Pet');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/:petId', auth, async (req, res) => {
  const pet = await Pet.findOne({ _id: req.params.petId, owner: req.user.id });
  if (!pet) return res.status(404).json({ msg: 'Pet não encontrado' });
  res.json(pet.posts || []);
});

router.post('/:petId', auth, async (req, res) => {
  const pet = await Pet.findOne({ _id: req.params.petId, owner: req.user.id });
  if (!pet) return res.status(404).json({ msg: 'Pet não encontrado' });
  const { type = 'image', media = '', caption = '' } = req.body || {};
  const post = { _id: String(Date.now()), type, media, caption, likes: 0, comments: 0, createdAt: new Date() };
  pet.posts.unshift(post);
  await pet.save();
  res.status(201).json(post);
});

router.post('/:petId/:postId/like', auth, async (req, res) => {
  const pet = await Pet.findOne({ _id: req.params.petId, owner: req.user.id });
  if (!pet) return res.status(404).json({ msg: 'Pet não encontrado' });
  const post = pet.posts.find(p => p._id === req.params.postId);
  if (!post) return res.status(404).json({ msg: 'Post não encontrado' });
  post.likes = (post.likes || 0) + 1;
  await pet.save();
  res.json(post);
});

module.exports = router;
