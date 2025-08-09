const mongoose = require('mongoose');

const PetSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  avatar: String,
  name: String,
  bio: String,
  album: [{ url: String, dataUpload: String }],
  posts: [
    {
      type: { type: String, enum: ['image', 'video', 'text'] },
      media: String,
      caption: String,
      likes: Number,
      comments: Number,
      createdAt: String,
    }
  ],
  lastNameEdit: String,
});

module.exports = mongoose.model('Pet', PetSchema);
