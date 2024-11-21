const express = require('express');
const app = express();
const poolRoutes = require('./routes/pooldb.js');
require('dotenv').config();
const port = process.env.PORT;
const expressLayouts = require('express-ejs-layouts')
const db = require('./database/db');

app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.json());
app.use('/pools', poolRoutes);


app.get('/', (req, res) => {
    res.render('index', {
        layout: 'layouts/main-layout'
    });
});

app.get('/view-data', (req, res) => {
    db.query('SELECT * FROM kolam_renang', (err, kolam_renang) => {
        if (err) return res.status(500).send('Internal Server Error');
        res.render('viewdb', {
            layout: 'layouts/main-layout',
            kolam_renang: kolam_renang
        });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});