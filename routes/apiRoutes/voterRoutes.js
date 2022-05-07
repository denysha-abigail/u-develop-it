const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck');

// GET route for voters
// performs a SELECT * FROM voters and returns the rows on success or 500 if errors
router.get('/voters', (req, res) => {
    const sql = `SELECT * FROM voters`;

    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

module.exports = router;