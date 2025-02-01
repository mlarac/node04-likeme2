const express = require('express');
const router = express.Router();
const { query } = require('../coneccionBD');

// Ruta para obtener todos los posts
router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM posts');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener posts:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ruta para crear un nuevo post
router.post('/', async (req, res) => {
  try {
    const { titulo, img, descripcion } = req.body;
    const result = await query(
      'INSERT INTO posts (titulo, img, descripcion, likes) VALUES ($1, $2, $3, 0) RETURNING *',
      [titulo, img, descripcion]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear post:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ruta para actualizar un post existente
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, img, descripcion } = req.body;
    const result = await query(
      'UPDATE posts SET titulo = $1, img = $2, descripcion = $3 WHERE id = $4 RETURNING *',
      [titulo, img, descripcion, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar post:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ruta para eliminar un post
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM posts WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }
    res.json({ message: 'Post eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar post:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;