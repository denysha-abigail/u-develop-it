const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck');

// db object is using the query() method that runs the sql query and executes the callback with all the resulting rows that match the query
// once the method executes the sql command, the callback function captures the responses in two variables -> err for the error response and rows for the database query response
// returns array of objects with each object representing a row of the candidates table ->
// {
//     id: 1,
//     first_name: 'Ronald',
//     last_name: 'Firbank',
//     industry_connected: 1
// },

// GET all candidates from candidates table
// route is designated with the endpoint /api/candidates
router.get('/candidates', (req, res) => {
    const sql = `SELECT candidates.*, parties.name
                AS party_name
                FROM candidates
                LEFT JOIN parties
                ON candidates.party_id = parties.id`;

    db.query(sql, (err, rows) => {
        if (err) {
            // send status code of 500 (server error) and place error message within JSON object
            res.status(500).json({ error: err.message });
            return;
        }
        // if no error, err is null
        res.json({
            message: 'success',
            data: rows
        });
    });
});

// GET a single candidate
// endpoint has route parameter that will hold the value of the id to specify which candidate we'll select from the database
router.get('/candidate/:id', (req, res) => {
    const sql = `SELECT candidates.*, parties.name
                AS party_name
                FROM candidates
                LEFT JOIN parties
                ON candidates.party_id = parties.id
                WHERE candidates.id = ?`;
    // in the database call, we'll assign the captured value populated in the req.params object with the key id to params
    // because params can be accepted in the database as an array, params is assigned as an array with a single element
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

// CREATE a candidate
// INSERT INTO to add values to candidates table that are assigned to the params const
            // const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected) 
            //                 VALUES (?, ?, ?, ?)`;
// four placeholders must match four values in params (an array must be used) as well as the order
            // const params = [1, 'Ronald', 'Firebank', 1];

            // db.query(sql, params, (err, result) => {
            //     if (err) {
            //         console.log(err);
            //     }
            //     console.log(result);
            // });

// CREATE a candidate
// post() to insert candidate into the candidates table
// used object destructuring to pull body property out of the req.body object
router.post('/candidate', ({ body }, res) => {
    // inputCheck module verifies that user info in the request can create a candidate; used to validate user data before the changes are inserted into the database
    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
    if (errors) {
        res.status(400).json({ errors });
        return;
    }

    // no need to specify id as mysql will autogenerate it for us
    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
        VALUES (?, ?, ?)`;
    // user data collected in req.body
    const params = [body.first_name, body.last_name, body.industry_connected];

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

// update a candidate's party
router.put('/candidate/:id', (req, res) => {
    // forces any PUT request to /api/candidate/:id to include a party_id property; even if the intention is to remove a party affiliation by setting it to null, the party_id property is still required
    const errors = inputCheck(req.body, 'party_id');

    if (errors) {
        res.status(400).json({ error: errors });
        return;
    }

    const sql = `UPDATE candidates SET party_id = ?
                WHERE id = ?`;
    const params = [req.body.party_id, req.params.id];
    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            // check if a record was found
        } else if (!result.affectedRows) {
            res.json({
                message: 'Candidate not found'
            });
        } else {
            res.json({
                message: 'success',
                data: req.body,
                changes: result.affectedRows
            });
        }
    });
});

// DELETE a candidate
// ? denotes a placeholder (making this a prepared statement that can execute the same sql statements repeatedly using different values in place of the placeholder)
// the additional parameter afterwards provides values to use in place of the prepared statement's placeholders
// equivalent to saying DELETE * FROM candidates WHERE id = 1 if the params value was 1
router.delete('/candidate/:id', (req, res) => {
    const sql = `DELETE FROM candidates WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.statusMessage(400).json({ error: res.message }); 
            // if user tries to delete a candidate that doesn't exist
        } else if (!result.affectedRows) {
            res.json({
                message: 'Candidate not found'
            });
        } else {
            res.json({
                message: 'deleted',
                // will verify whether any rows were changed and how many
                changes: result.affectedRows,
                id: req.params.id
            });
        }
    });
});

module.exports = router;