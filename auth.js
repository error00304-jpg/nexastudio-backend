// Registro y login para el modo offline del launcher.
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// POST /api/auth/register  { username, email, password, inviteCode? }
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, inviteCode } = req.body || {};
    if (process.env.INVITE_CODE && inviteCode !== process.env.INVITE_CODE)
      return res.status(403).json({ error: 'Código de invitación inválido' });
    if (!username || !email || !password || password.length < 8)
      return res.status(400).json({ error: 'Datos inválidos (contraseña mínima: 8 caracteres)' });

    const passwordHash = await bcrypt.hash(password, 12); // BCrypt, 12 rondas
    await User.create({ username, email, passwordHash });
    res.status(201).json({ ok: true });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ error: 'Usuario o correo ya registrado' });
    if (err.name === 'ValidationError') return res.status(400).json({ error: 'Nick: 3-16 letras, números o _' });
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// POST /api/auth/login  { username, password }  ->  { token, username }
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body || {};
    const user = await User.findOne({ username });
    // Mismo mensaje para usuario inexistente o clave errónea (no filtra qué falló)
    if (!user || !(await bcrypt.compare(password || '', user.passwordHash)))
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });

    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, username: user.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

module.exports = router;
