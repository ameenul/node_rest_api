const db = require('../config/db');
const path = require('path');

// exports.addCatatan = (req, res) => {
//   const userId = req.user.id;
//   const { judul, isi } = req.body;
//   // req.file.path atau req.file.filename sesuai kebutuhan
//   const imgPath = req.file ? req.file.filename : null;

//   const sql = `
//     INSERT INTO catatan (user_id, judul, isi, img)
//     VALUES (?, ?, ?, ?)
//   `;
//   db.query(sql, [userId, judul, isi, imgPath], (err, result) => {
//     if (err) {
//       console.error('Error menambah catatan:', err);
//       return res.status(500).json({ error: 'Database error' });
//     }
//     res.status(201).json({
//       id: result.insertId,
//       message: 'Catatan ditambahkan',
//       img: imgPath ? `/uploads/${imgPath}` : null
//     });
//   });
// };

// controllers/catatanController.js

exports.addCatatan = (req, res) => {
  const userId = req.user.id;
  const { judul, isi } = req.body;
  const imgPath = req.file ? req.file.filename : null;

  // 1️⃣ INSERT
  const sqlInsert = `
    INSERT INTO catatan (user_id, judul, isi, img)
    VALUES (?, ?, ?, ?)
  `;
  db.query(sqlInsert, [userId, judul, isi, imgPath], (err, result) => {
    if (err) {
      console.error('Error menambah catatan:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    const newId = result.insertId;

    // 2️⃣ SELECT row yang baru saja di-insert
    const sqlSelect = `
      SELECT 
        id,
        user_id,
        judul,
        isi,
        created_at,
        CASE 
          WHEN img IS NOT NULL THEN CONCAT('/uploads/', img)
          ELSE NULL
        END AS img
      FROM catatan
      WHERE id = ?
    `;
    db.query(sqlSelect, [newId], (err2, rows) => {
      if (err2) {
        console.error('Error fetching new catatan:', err2);
        return res.status(500).json({ error: 'Database error' });
      }
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Catatan not found' });
      }

      // 3️⃣ Kembalikan objek lengkap
      res.status(201).json(rows[0]);
    });
  });
};

exports.getCatatanUser = (req, res) => {
  const userId = req.user.id;
  const sql = `
    SELECT id, judul, isi, created_at,
           IF(img IS NOT NULL, CONCAT('/uploads/', img), NULL) AS img
      FROM catatan
     WHERE user_id = ?
     ORDER BY created_at DESC
  `;
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Error mengambil catatan:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
};

exports.deleteCatatan = (req, res) => {
  const userId = req.user.id;
  const catatanId = req.params.id;
  const sql = `DELETE FROM catatan WHERE id = ? AND user_id = ?`;
  db.query(sql, [catatanId, userId], (err, result) => {
    if (err) {
      console.error('Error menghapus catatan:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Catatan tidak ditemukan' });
    }
    res.json({ message: 'Catatan dihapus' });
  });
};
