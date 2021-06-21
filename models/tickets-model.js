const { Schema } = require('mongoose')
const mongoose = require('../db/connection')

const TicketSchema = new Schema({

    title: {
        type: String,
        required : true
        
    },
    desc : {
        type: String,
        required : true
    },
    offer : {
        type: Number,
        required : true
    },
    img : { 
        data: Buffer, 
        contentType: String,
       
        
     },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
},
{timestamps : true}
)

const Tickets = mongoose.model('Tickets', TicketSchema)
module.exports = Tickets;