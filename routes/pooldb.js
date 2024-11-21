const express = require('express');
const router = express.Router();
const db = require('../database/db');

router.get('/', (req, res) => {
    db.query('SELECT * FROM kolam_renang', (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        res.json(results);
    });
});

router.post('/', (req, res) => {
    const { nama, lokasi, jam_opr, harga } = req.body;

    if (!nama || !lokasi || !jam_opr || !harga) {
        return res.status(400).json({ error: 'Data tidak lengkap' });
    }

    const query = 'INSERT INTO kolam_renang (nama, lokasi, jam_opr, harga) VALUES (?, ?, ?, ?)';
    db.query(query, [nama, lokasi, jam_opr, harga], (err, result) => {
        if (err) {
            console.error('Error saat menyimpan ke database:', err);
            return res.status(500).json({ error: 'Gagal menyimpan data' });
        }

        res.status(201).json({ message: 'Data berhasil disimpan', id: result.insertId });
    });
});


router.get('/:id', (req, res) => {
    db.query('SELECT * FROM kolam_renang WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        if (results.length === 0) return res.status(404).send('Data tidak ditemukan');
        res.json(results[0]);
    });
});

router.put('/:id', (req, res) => {
    const id = req.params.id; // Ambil ID dari parameter URL
    const { nama, lokasi, jam_opr, harga } = req.body; // Ambil data dari body

    // Pastikan semua data ada
    if (!nama || !lokasi || !jam_opr || !harga) {
        return res.status(400).json({ error: 'Data tidak lengkap' });
    }

    const query = 'UPDATE kolam_renang SET nama = ?, lokasi = ?, jam_opr = ?, harga = ? WHERE id = ?';
    db.query(query, [nama, lokasi, jam_opr, harga, id], (err, result) => {
        if (err) {
            console.error('Error memperbarui data:', err);
            return res.status(500).json({ error: 'Gagal memperbarui data' });
        }

        // Jika tidak ada data yang diupdate
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Data tidak ditemukan' });
        }

        res.json({ message: 'Data berhasil diperbarui' });
    });
});

// Route untuk menghapus data kolam renang
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    const query = 'DELETE FROM kolam_renang WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error menghapus data:', err);
            return res.status(500).json({ error: 'Gagal menghapus data' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Data tidak ditemukan' });
        }
        res.json({ message: 'Data berhasil dihapus' });
    });
});

module.exports = router;