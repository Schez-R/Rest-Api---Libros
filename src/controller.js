import { pimport { pool } from './database.js';

class LibrosController {

	async getAll(req, res) {
		// Intentará ejecutar el código dentro del bloque try y si se produce una excepción, se manejará en el bloque catch.
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

	async add(req, res) {
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
   //Se construye una consulta SQL de inserción con los valores correspondientes y se ejecuta.
   try {
   	// Ejecutamos la consulta y obtenemos el resultado.
    const [result] = await pool.query(query, values);
     // El resultado de la consulta se almacena en result, respondemos con el "Id" del libro insertado.
    res.json({ "Id insertado": result.insertId });
  } catch (error) {
  	// En caso de error durante el proceso, respondemos con un mensaje de error en formato JSON.
    res.status(500).json({ error: 'Error al agregar el libro' });
  }
}

	async delete(req, res) {
   const libro = req.body;
   // Verificar si se proporcionó el campo "ISBN" en la solicitud.
   if (!libro.ISBN) {
      res.status(400).json({ error: 'El campo "ISBN" es obligatorio para eliminar un libro.' });
      return;
    }
  // Verificar si el libro existe en la base de datos.
  try {
    const [result] = await pool.query('SELECT * FROM Libros WHERE ISBN = ?', [libro.ISBN]);
    if (result.length === 0) {
      res.status(404).json({ error: 'Libro no encontrado' });
      return;
    }
    // Si el libro existe, se procede a construir la consulta SQL para eliminarlo.
    const deleteQuery = `DELETE FROM Libros WHERE ISBN = ?`;

      // Intentar ejecutar la consulta para eliminar el libro.
      try {
        const [deleteResult] = await pool.query(deleteQuery, [libro.ISBN]);
        res.json({ "Registros eliminados": deleteResult.affectedRows });
        // Manejar errores durante la eliminación y responder con un mensaje de error.
      } catch (deleteError) {
        res.status(500).json({ error: 'Error al eliminar el libro' });
      }
      // Manejar errores al verificar la existencia del libro y responder con un mensaje de error.
    } catch (error) {
      res.status(500).json({ error: 'Error al verificar la existencia del libro' });
    }
  }

	async update(req, res) {
		const libro = req.body;
		const [result] = await pool.query(`UPDATE Libros SET nombre=?, autor=?, categoria=?, \`año-publicacion\`=?,ISBN=? WHERE id=?`, [libro.nombre, libro.autor, libro.categoria, libro['año-publicacion'], libro.ISBN, libro.id]);
		res.json({"Registros actualizados": result.changedRows});
	}

	async getOne(req, res) {
		const libroId = req.params.id; // Obtener el ID del parámetro de la URL
	try {
    	const [result] = await pool.query('SELECT * FROM Libros WHERE id = ?', [libroId]);
    if (result.length === 1) {
      res.json(result[0]); // Responder con el libro encontrado
    } else {
      res.status(404).json({ error: 'Libro no encontrado con esa id' }); // Responder libro no encontrado
    }
  } catch (error) {
      res.status(500).json({ error: 'Error al obtener el libro' });
  }
}

}
export const libro = new LibrosController();