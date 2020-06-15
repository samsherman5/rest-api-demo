const mongoose = require('mongoose');

const common = require('./common')



const accountSchema = mongoose.Schema({
    _id: String,
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    role: {type: common.roles, required: true},
    email: {
        type: String,
        unique: true,
        //For email validation
        match: /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/
    },
    //Any of the fields student_data, parent_data, or teacher_data should be left as null if that field does not apply to the accounts role
    student_data: {
        address: {type: String},
        bitbucketusername: {type: String},
        classes: [{type: common.ClassRegistration}],

        allergies: [String],
        emergencyContact: common.EmergencyContact,
        parents: [{type: mongoose.Schema.Types.ObjectId, ref: 'Account'}],
        //TODO: add awards and evals
    },
    parent_data: {
        address: String,
        phone_number: String,
        children: [{type: mongoose.Schema.Types.ObjectId, ref: 'Account'}]
    },
    teacher_data: {
        address: String,
        classes: [String]
    }
});



module.exports = mongoose.model('Accounts', accountSchema);
