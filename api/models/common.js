const mongoose = require('mongoose');

exports.roles = {
    owner: {type: Boolean, default: false},
    admin: {type: Boolean, default: false},
    parent: {type: Boolean, default: false},
    student: {type: Boolean, default: false},
    teacher: {type: Boolean, default: false},
    lead_teacher: {type: Boolean, default: false}
};

exports.EmergencyContact = mongoose.Schema({
    name: {type: String},
    phone_number: {type: String}
});

exports.generateClassID = function(year, session, className){
    return year.toLowerCase() + '_' + session.toLowerCase() + '_' + className.toLowerCase();
}

exports.ClassRegistration = mongoose.Schema({
    classId: String,
    session: String,
    isOvernighter: Boolean,
    dates: [{String}]
});

