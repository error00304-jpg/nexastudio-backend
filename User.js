// Esquema de usuario. Nunca se guarda la contraseña en claro, solo su hash BCrypt.
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 16,
              match: /^[A-Za-z0-9_]+$/ }, // Mismas reglas que un nick de Minecraft
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
