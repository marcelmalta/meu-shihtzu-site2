const mongoose = require('mongoose');

const PostSub = new mongoose.Schema({
  _id: { type: String, required: true },
  type: { type: String, enum: ['image','video','text'], default: 'image' },
  media: String,
  caption: String,
  likes: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
}, { _id: false });

const PetSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, required: true },
  name: { type: String, required: true, trim: true },
  bio: { type: String, default: '' },
  avatar: { type: String, default: '' },
  posts: { type: [PostSub], default: [] },
  lastNameEdit: { type: String, default: () => new Date().toISOString().slice(0,10) },
}, { timestamps: true });

module.exports = mongoose.model('Pet', PetSchema);
