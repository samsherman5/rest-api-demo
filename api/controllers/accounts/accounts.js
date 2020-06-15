const mongoose = require('mongoose');
const Account = require('../../models/account');

//GET requests
exports.get_all_accounts = (req, res, next) => {
    Account.find()
        .select('_id first_name last_name email role')
        .exec()
        .then(docs => {
            const response = {
                accounts: docs.map(doc => {
                    return {
                        _id: doc._id,
                        first_name: doc.first_name,
                        last_name: doc.last_name,
                        email: doc.email,
                        role: doc.role,
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

exports.get_account = (req, res, next) => {
    const id = req.params.accountId;
    Account.findById(id)
        .select('_id first_name last_name email role student_data parent_data teacher_data')
        .then(doc => {
            if(doc){
                res.status(200).json({
                    account: {
                        _id: doc.id,
                        first_name: doc.first_name,
                        last_name: doc.last_name,
                        email: doc.email,
                        role: doc.role,
                        student_data: doc.student_data,
                        parent_data: doc.parent_data,
                        teacher_data: doc.teacher_data
                    }
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

//UPDATE request
exports.update_student = (req, res, next) => {
    const id = req.params.accountId;
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Account.update({_id: id}, { $set: updateOps})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Account updated',
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.status = 500;
            next(error);
        });
};

//DELETE request
exports.delete_account = (req, res, next) => {
    const id = req.params.accountId;

    Account.deleteOne({_id: id})
        .then(result => {
            res.status(200).json({
                message: "Account deleted"
            })
        })
        .catch(err => {
            const error = new Error(err);
            error.status = 500;
            next(error);
        });
};
