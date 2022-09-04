const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const errorsController = require('./controllers/errors-controller');
const sequelize = require('./util/database');  // pool connection

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const Product = require('./models/product');
const User = require('./models/user');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// pass user object through requests
app.use((req, res, next) => {
    User.findByPk(1)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

app.use('/admin', adminData.routes);
app.use(shopRoutes);

app.use(errorsController.get404);


/**
 * Here we will define association between 
 * items in the database.
 */

/// Product(m) <=> User(1)
User.hasMany(Product);
Product.belongsTo(User,
    {
        constraints: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });

// sync defined models with sql database
sequelize
    .sync()
    .then(result => {

        // Create one user instance
        User.findByPk(1)
            .then(user => {
                if (!user) {
                    return User.create({
                        name: 'Alaa Zamel',
                        email: 'alaa.zamel80@gmail.com',
                    });
                }
                return user;
            })
            .then(user => {
                console.log(user);
                app.listen(3000);
            })
            .catch(err => console.log(err));
    })
    .catch(err => {
        console.log(err);
    });
