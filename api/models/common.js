const mongoose = require('mongoose');

exports.roles = mongoose.Schema({
    owner: {type: Boolean, default: false},
    admin: {type: Boolean, default: false},
    parent: {type: Boolean, default: false},
    student: {type: Boolean, default: false},
    teacher: {type: Boolean, default: false},
    lead_teacher: {type: Boolean, default: false}
});
