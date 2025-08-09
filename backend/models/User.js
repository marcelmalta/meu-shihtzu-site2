const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    name:    { type: String, required: true },
    email:   { type: String, required: true, unique: true, index: true },
    password:{ type: String, required: true },
  },
  { timestamps: true }
);

// Hash da senha antes de salvar
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Comparar senha no login
UserSchema.methods.matchPassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
