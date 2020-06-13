const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product')

router.get('/', (req, res, next) => {
    Order.find()
        .select('_id product quantity')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request: {
                            type: 'GET',
                            url: process.env.IP + 'orders/' + doc._id
                        }
                    };
                })
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.status = 500;
            next(error);
        });
});

router.post('/', (req, res, next) => {
    Product.findById(req.body.product)
        .then(product => {
            if (!product) {
                const error = new Error("Product not found");
                error.status = 404;
                next(error);
            }
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.product
            });
            return order.save();
        })
        .then(result => {
            res.status(201).json({
                message: "Order created",
                createdOrder: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity
                },
                request: {
                    type: "GET",
                    url: process.env.IP + "orders/" + result._id
                }
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.status = 500;
            next(error);
        });
});

router.get('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    Order.findById(id)
        .select('_id product quantity')
        .exec()
        .then(doc => {
            if(doc){
                res.status(200).json({
                    order: doc,
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

router.delete('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    Order.deleteOne({_id: id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Order deleted'
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.status = 500;
            next(error);
        });
});

module.exports = router;
