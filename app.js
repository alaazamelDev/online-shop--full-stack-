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
const Cart = require('./models/cart');
const Order = require('./models/order');
const CartItem = require('./models/cart-item');
const OrderItem = require('./models/order-item');


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

/// User(1) <=> Cart(1)
User.hasOne(Cart);
Cart.belongsTo(User,
    {
        constraints: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });

/// Cart(m) <=> Product(m)
Cart.belongsToMany(Product, { through: CartItem })
Product.belongsToMany(Cart, { through: CartItem })

/// Order(m) <=> User(1)
User.hasMany(Order);
Order.belongsTo(User,
    {
        constraints: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    });

/// Order(m) <=> Product(m)
Product.belongsToMany(Order, { through: OrderItem });
Order.belongsToMany(Product, { through: OrderItem });

// sync defined models with sql database
sequelize
    // .sync({ force: true })
    .sync()
    .then(() => {
        // Create one user instance
        User.findByPk(1)
            .then(user => {
                if (!user) {
                    return User.create({
                        name: 'Alaa Zamel',
                        email: 'alaa.zamel80@gmail.com',
                    }).then(user => {
                        return user.createCart();
                    });
                }
                return user;
            })
            .then(cart => {

                app.listen(3000);
            })
            .catch(err => console.log(err));
    })
    .catch(err => {
        console.log(err);
    });
