const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/');
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimeType === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null,true);
    } else{
        cb(null,false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

const Product = require('../models/product');

router.get('/', (req, res, next) => {
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
});

router.post('/', checkAuth, upload.single('productImage'), (req, res, next) => {

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
});

router.get('/:productId', (req, res, next) => {
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
});

router.patch('/:productId', checkAuth, (req, res, next) => {
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
});

router.delete('/:productId', checkAuth, (req, res, next) => {
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
});

module.exports = router;
