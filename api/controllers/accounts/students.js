const mongoose = require('mongoose');
const Account = require('../../models/account');

//GET requests
exports.get_all_students = (req, res, next) => {
    Account.find({role: {student:true}})
        .select('_id first_name last_name student_data')
        .exec()
        .then(docs => {
            const response = {
                students: docs.map(doc => {
                    return {
                        _id: doc._id,
                        first_name: doc.first_name,
                        last_name: doc.last_name,
                        email: doc.email,
                        student_data: doc.student_data
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

//POST request
exports.create_student = (req, res, next) => {
    Account.find({email: req.body.email})
        .then(docs => {
            if(docs.length>=1){
                return res.status(409).json({
                    message: 'Email already in use'
                });
            } else {
                const student = new Account({
                    _id: req.body.first_name + "_" + req.body.last_name,
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    email: req.body.email,
                    role: {
                        student: true
                    },
                    student_data: req.body.student_data
                });
                student.save()
                    .then(result => {
                        res.status(201).json({
                            message: 'Created student',
                            createdStudent: {
                                _id: result._id,
                                first_name: result.first_name,
                                last_name: result.last_name,
                                email: result.email,
                                student_data: result.student_data,
                            }
                        });
                    }).catch(err=>{
                    const error = new Error(err);
                    error.status = 500;
                    next(error);
                });
            }
        }).catch(err => {
            const error = new Error(err);
            error.status = 500;
            next(error);
        });
};


