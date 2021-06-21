const { Schema } = require('mongoose')
const mongoose = require('../db/connection')

const UserSchema = new Schema({

    name: {
        type:String,
        required : true
    },
    phone : {
        type: Number,
        required : true

    },
    email : {
        type: String,
        required : true
    },
},
{timestamps : true}
)

const User = mongoose.model('User', UserSchema)
module.exports = User;