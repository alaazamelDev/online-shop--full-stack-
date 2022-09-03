const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const errorsController = require('./controllers/errors-controller');
const db = require('./util/database');  // pool connection

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

db.execute('SELECT * FROM products')
    .then(result => {
        console.log(result);
    })
    .catch(err => {
        console.log(err);
    });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminData.routes);
app.use(shopRoutes);

app.use(errorsController.get404);

app.listen(3000);
