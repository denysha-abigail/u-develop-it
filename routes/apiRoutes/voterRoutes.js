const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck');

// GET route for voters
// performs a SELECT * FROM voters and returns the rows on success or 500 if errors
router.get('/voters', (req, res) => {
    // rows can be sorted on retrieval simply by including an ORDER BY clause
    const sql = `SELECT * FROM voters ORDER BY last_name`;

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

// get single voter
router.get('/voter/:id', (req, res) => {
    const sql = `SELECT * FROM voters WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        } 
        res.json({
            message: 'success',
            data: row
        });
    });
});

// allow people to register through the app (POST)
router.post('/voter', ({ body }, res) => {
    // although the ? prepared statements will protect us from malicious data, we should also take into consideration preventing blank records from being created
    // data validation
    const errors = inputCheck(body, 'first_name', 'last_name', 'email');
    if (errors) {
        res.status(400).json({ error: errors });
        return;
    }
    
    const sql = `INSERT INTO voters (first_name, last_name, email) VALUES (?, ?, ?)`;
    const params = [body.first_name, body.last_name, body.email];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: body
        });
    });
});

// allow people to update their email address (PUT)

// allow people to deactivate their account (DELETE)

module.exports = router;