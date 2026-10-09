// Punto de entrada: Express + conexión a MongoDB Atlas.
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10kb' })); // Evita cuerpos enormes

// Ruta de salud: úsala para "despertar" el servicio gratuito de Render.
app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/api/auth', require('./routes/auth'));

const PORT = process.env.PORT || 3000; // Render inyecta PORT
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB Atlas conectado');
    app.listen(PORT, () => console.log(`API NexaStudio en puerto ${PORT}`));
  })
  .catch((err) => {
    console.error('Error conectando a MongoDB:', err.message);
    process.exit(1);
  });
