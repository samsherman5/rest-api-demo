const mongoose = require('mongoose');
const Product = require('../models/product');

exports.products_get_all = (req, res, next) => {
    Product.find()
        .select('_id name price productImage')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        _id: doc._id,
                        name: doc.name,
                        price: doc.price,
                        productImage: doc.productImage,
                        request: {
                            type: 'GET',
                            url: process.env.IP + 'products/' + doc._id
                        }
                    };
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            const error = new Error(err);
            error.status = 500;
            next(error);
        });
};

exports.create_product = (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product.save()
        .then(result => {
            res.status(201).json({
                message: 'Created product',
                createdProduct: {
                    _id: result._id,
                    name: result.name,
                    price: result.price,
                    productImage: result.productImage,
                    request:{
                        type: 'GET',
                        url: process.env.IP + 'products/' + result._id
                    }
                }
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.status = 500;
            next(error);
        });
};

exports.products_get_one = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select('_id name price productImage')
        .exec()
        .then(doc => {
            if(doc){
                res.status(200).json({
                    product: doc,
                });
            } else {
                const error = new Error('No valid entry for provided ID');
                error.status = 404;
                next(error);
            }
        })
        .catch(err => {
            const error = new Error(err);
            error.status = 500;
            next(error);
        });
};

exports.update_product = (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Product.update({_id: id}, { $set: updateOps})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Product updated',
                request: {
                    type: 'GET',
                    url: process.env.IP + 'products/' + id
                }
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.status = 500;
            next(error);
        });
};

exports.delete_product = (req, res, next) => {
    const id = req.params.productId;

    Product.deleteOne({_id: id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Product deleted'
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.status = 500;
            next(error);
        });
};
