const express = require('express')
const router = express.Router()
const User = require('../models/user-model')

// all users route
router.get('/tickets/users', (req,res) =>{
    User.find({})
    .then((users) =>{
        res.json(users)
    })

})

// get usr by id route
router.get('/tickets/users/:id', (req,res) =>{
    var id = req.params.id
    User.findOne({_id : id})
    .then(userId =>{
        res.json(userId)
    })
})

module.exports = router