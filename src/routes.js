import { Router } from 'express';
import { libro } from './controller.js';

export const router = Router();

// Ruta para obtener todos los libros
router.get('/libros', libro.getAll);

// Ruta para obtener un libro por ID
router.get('/libros/:id', libro.getOne);

// Ruta para agregar un libro
router.post('/libros', libro.add);

// Ruta para eliminar un libro por ID
router.delete('/libros/:id', libro.delete);

// Ruta para actualizar un libro por ID
router.put('/libros/:id', libro.update);