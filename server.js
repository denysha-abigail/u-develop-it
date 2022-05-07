const express = require('express');
const db = require('./db/connection');
// no need to specify index.js in the path as node.js will automatically look for it when requiring the directory
const apiRoutes = require('./routes/apiRoutes');

const PORT = process.env.PORT || 3001;
const app = express();

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// by adding the /api prefix here, we can remove it from the individual route expressions after we move them to their new home
// use apiRoutes
app.use('/api', apiRoutes);

// default response for any other request (Not Found)
// displays 404 response when user tries undefined endpoints at the server
// this is a catchall route and must be placed as the last route as it overrides all the others if placed before
app.use((req, res) => {
    res.status(404).end();
});

// Start server after DB connection
db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });