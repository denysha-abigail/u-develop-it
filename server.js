const express = require('express');
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// connect to the database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // your MySQL username
        user: 'root',
        // your MySQL password
        password: 'ana0314*',
        database: 'election'
    },
    console.log('Connected to the election database.')
);

// test connection
// db object is using the query() method that runs the sql query and executes the callback with all the resulting rows that match the query
// once the method executes the sql command, the callback function captures the responses in two variables -> err for the error response and rows for the database query response
// returns array of objects with each object representing a row of the candidates table ->
// {
//     id: 1,
//     first_name: 'Ronald',
//     last_name: 'Firbank',
//     industry_connected: 1
// },
            // db.query(`SELECT * FROM candidates`, (err, rows) => {
            //     console.log(rows);
            // });

// GET a single candidate
db.query(`SELECT * FROM candidates WHERE id = 1`, (err, row) => {
    if (err) {
        console.log(err);
    }
    console.log(row);
});

// DELETE a candidate
// ? denotes a placeholder (making this a prepared statement that can execute the same sql statements repeatedly using different values in place of the placeholder)
// the additional parameter afterwards provides values to use in place of the prepared statement's placeholders
// equivalent to saying DELETE * FROM candidates WHERE id = 1 
db.query(`DELETE FROM candidates WHERE id = ?`, 1, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log(result);
  });

// default response for any other request (Not Found)
// displays 404 response when user tries undefined endpoints at the server
// this is a catchall route and must be placed as the last route as it overrides all the others if placed before
app.use((req, res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});