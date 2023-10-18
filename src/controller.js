import { pool } from './database.js';

class LibrosController {

	async getAll(req, res) {
		const [result] = await pool.query('SELECT * FROM Libros');
		res.json(result);
	}

	async add(req, res) {
		const libro = req.body;
		const [result] = await pool.query(`INSERT INTO libros(nombre, autor, categoria, \`año-publicacion\`, ISBN) VALUES (?,?,?,?,?)`, [libro.nombre, libro.autor, libro.categoria, libro['año-publicacion'], libro.ISBN]);
		res.json({"Id insertado": result.insertId});
	}

	async delete(req, res) {
		const libro = req.body;
		const [result] = await pool.query(`DELETE FROM Libros WHERE id=(?)`, [libro.id]);
		res.json({"Registros eliminados": result.affectedRows});
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