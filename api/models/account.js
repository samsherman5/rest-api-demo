const mongoose = require('mongoose');

const common = require('./common')



const accountSchema = mongoose.Schema({
    _id: "temp",
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    role: {type: common.roles, required: true},
    //Any of the fields student_data, parent_data, or teacher_data should be left as null if that field does not apply to the accounts role
    student_data: {
        email: {
            type: String,
            unique: true,
            match: /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/
        },
        address: {type: String},
        parents: [{type: accountSchema._id, ref: 'Account'}],
        allergies: {type: String},

    },
    parent_data: {
        email: {
            type: String,
            unique: true,
            match: /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/
        },
        address: {type: String},
        phone_number: {type: String},
        children: {type: mongoose.Schema.Types.ObjectId, ref: 'Account'}
    },
    teacher_data: {

    }
});

accountSchema.pre('save', function(next) {
    this._id = this.first_name + '_' + this.last_name;
    next();
});
