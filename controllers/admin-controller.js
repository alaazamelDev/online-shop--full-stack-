const Product = require('../models/product')

exports.getAddProduct = (req, res, next) => {
    res.render('admin/add-edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
    });
}

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const description = req.body.description;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const product = new Product({
        id: null,
        title: title,
        description: description,
        imageUrl: imageUrl,
        price: price,
    });
    product.save().then(result => {
        res.redirect('/');
    }).catch(err => console.log(err));
};


exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const productId = req.params.productId;
    Product.findById(productId)
        .then(([products, fieldData]) => {
            if (!products[0]) {
                return res.redirect('/');
            }
            res.render('admin/add-edit-product', {
                product: products[0],
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                editing: editMode,
            });
        })
        .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
    const productId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedDescription = req.body.description;
    const updatedImageUrl = req.body.imageUrl;
    const updatedPrice = req.body.price;
    const updatedProduct = new Product({
        id: productId,
        title: updatedTitle,
        imageUrl: updatedImageUrl,
        description: updatedDescription,
        price: updatedPrice,
    });
    updatedProduct.update()
        .then(result => res.redirect('/admin/products'))
        .catch(err => console.log(err));

};

exports.getAdminProducts = (req, res, next) => {
    Product.fetchAll()
        .then(([products, fieldData]) => {
            res.render('admin/products', {
                prods: products,
                pageTitle: 'Admin Products',
                path: '/admin/products',
            });
        });
};


exports.postDeleteProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product.deleteById(productId)
        .then(result => res.redirect('/admin/products'))
        .catch(err => console.log(err));

};
