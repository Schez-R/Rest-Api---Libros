import { pool } from './database.js';

class LibrosController {

  // Este método se utiliza para obtener todos los libros de la base de datos.
  async getAll(req, res) {
    try {
      // Realizamos una consulta SQL para seleccionar todos los libros en la tabla "Libros", el resultado se almacena en la variable result.
      const [result] = await pool.query('SELECT * FROM Libros');
      // Respondemos con los resultados en formato JSON.
      res.json(result);
    } catch (error) {
      // En caso de error, respondemos con un mensaje de error en formato JSON.
      res.status(500).json({ error: 'Error al obtener los libros' });
    }
  }

  // Este método se utiliza para agregar un libro.
  async add(req, res) {
    try {
      const libro = req.body;

      // Verificamos si el libro recibido contiene al menos un nombre, un autor y un ISBN.
      if (!libro.nombre || !libro.autor || !libro.ISBN) {
        // Si falta alguno de estos campos, respondemos con un mensaje de error.
        res.status(400).json({ error: 'Nombre, autor e ISBN son campos obligatorios.' });
        return;
      }

      // Construimos una consulta SQL de inserción con los valores correspondientes.
      const query = `INSERT INTO libros(nombre, autor, categoria, \`año-publicacion\`, ISBN) VALUES (?,?,?,?,?)`;
      const values = [libro.nombre, libro.autor, libro.categoria || null, libro['año-publicacion'] || null, libro.ISBN];

      // Se construye una consulta SQL de inserción con los valores correspondientes y se ejecuta.
      // Ejecutamos la consulta y obtenemos el resultado.
      const [result] = await pool.query(query, values);
      // El resultado de la consulta se almacena en result, respondemos con el "Id" del libro insertado.
      res.json({ "Id insertado": result.insertId });
    } catch (error) {
      // En caso de error durante el proceso, respondemos con un mensaje de error en formato JSON.
      res.status(500).json({ error: 'Error al agregar el libro' });
    }
  }

  // Este método se utiliza para eliminar un libro por su ISBN.
  async delete(req, res) {
    try {
      const isbn = req.params.isbn; // Obtener el ISBN desde los parámetros de la URL
      if (!isbn) {
        res.status(400).json({ error: 'El campo "ISBN" es obligatorio para eliminar un libro.' });
        return;
      }

      // Verificar si el libro existe en la base de datos.
      const [result] = await pool.query('SELECT * FROM Libros WHERE ISBN = ?', [isbn]);

      if (result.length === 0) {
        res.status(404).json({ error: 'Libro no encontrado' });
        return;
      }

      const deleteQuery = `DELETE FROM Libros WHERE ISBN = ?`;

      const [deleteResult] = await pool.query(deleteQuery, [isbn]);
      res.json({ "Registros eliminados": deleteResult.affectedRows });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el libro' });
    }
  }

  // Este método se utiliza para actualizar un libro.
  async update(req, res) {
    try {
      // Obtener los datos del libro desde la solicitud.
      const libro = req.body;

      // Verificar si los campos obligatorios (id, nombre, autor e ISBN) están presentes.
      if (!libro.id || !libro.nombre || !libro.autor || !libro.ISBN) {
        res.status(400).json({ error: 'Los campos "id", "nombre", "autor" e "ISBN" son obligatorios.' });
        return;
      }

      // Realizar una consulta SQL para actualizar el libro en la base de datos.
      const [result] = await pool.query(
        `UPDATE Libros SET nombre=?, autor=?, categoria=?, \`año-publicacion\`=?, ISBN=? WHERE id=?`,
        [libro.nombre, libro.autor, libro.categoria, libro['año-publicacion'], libro.ISBN, libro.id]
      );

      // Verificar si se actualizó al menos un registro en la base de datos.
      if (result.affectedRows > 0) {
        res.json({ "Registros actualizados": result.changedRows });
      } else {
        res.status(404).json({ error: 'No se encontró un libro con el ID proporcionado' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar el libro', details: error.message });
    }
  }

  // Este método se utiliza para obtener un libro por su ID.
  async getOne(req, res) {
    try {
      // Obtener el ID del libro desde los parámetros de la URL.
      const libroId = req.params.id;
      // Verificar si el ID es proporcionado en la solicitud.
      if (!libroId) {
        res.status(400).json({ error: 'El parámetro de ID es obligatorio' });
        return;
      }

      // Realizar una consulta SQL para seleccionar el libro con el ID correspondiente.
      const [result] = await pool.query('SELECT * FROM Libros WHERE id = ?', [libroId]);
      
      // Verificar si se encontró exactamente un libro
      if (result.length === 1) {
        res.json(result[0]); // Responder con el libro encontrado en formato JSON.
      } else {
        res.status(404).json({ error: 'Libro no encontrado con ese ID' }); // Responder libro no encontrado.
      }
    } catch (error) {
      // En caso de error durante el proceso, responder con un mensaje de error en formato JSON y detalles del error.
      res.status(500).json({ error: 'Error al obtener el libro', details: error.message });
    }
  }
}

export const libro = new LibrosController();