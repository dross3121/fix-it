const express = require('express')
const passport = require('passport')
const fs = require('fs');
const multer = require('multer');
const path = require('path');
require('dotenv/config');
const router = express.Router()
const Tickets = require('../models/tickets-model')
const User = require('../models/user-model')


router.get('/', (req,res) =>{
    res.render('signin')
})

// stroage path for uploaded photos
const storage = multer.memoryStorage()
const  filename = (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true)
        } else {
            cb(null, false)
        }
      };
const upload = multer({
        storage: storage,
        limits: {
            fileSize: 1024 * 1024 * 5
        },
        filename : filename
      })
      

// [X] index route to show all tickets
router.get('/tickets/',(req, res) => {
        Tickets.find({})
        .populate('owner')
        .then((tickets) =>{
            res.render('index', {tickets : tickets})
        })
        .catch(console.error);
    });



// add /new route for this form to create new tickets 
router.get('/tickets/new/', (req,res) =>{
    res.render('new')
})
router.post('/tickets/', upload.single('image'), (req, res, next) => {
    let newTicket = {
        title: req.body.title,
        desc: req.body.desc,
        offer: req.body.offer,
        img: {
            data: req.file.buffer,
            contentType: req.file.mimetype
        }
    }
    Tickets.create(newTicket)
    .then(ticket => {
        console.log(ticket)
        res.redirect('/tickets')
    })
    .catch(console.error);
});

// get one ticket by id route/show route
router.get('/tickets/:id', (req,res) =>{
    let id = req.params.id
    Tickets.findById(id)
    .populate('users')
    .then((ticket) =>{
       res.render('show', {ticket : ticket})
    })
    .catch(console.error);
})

// [x] grab a ticket by id and render to the PUT route to update

router.get('/tickets/:id/edit', (req,res) =>{
    let id = req.params.id
    console.log(id)
    Tickets.findById(id)
    .then((ticket) =>{
       res.render('edit', {ticket : ticket})
    })
})

// [X]  update a ticket route
router.put('/tickets/:id', upload.single('image'),(req,res, next) =>{
    let id = req.params.id
    let filename;
    Tickets.findOneAndUpdate(
        {_id : id},
        {
            title: req.body.title,
            desc: req.body.desc,
            offer: req.body.offer,
            img: {
                data: req.file.buffer,
                contentType: req.file.mimetype
            }
        },
        {new : true}
        )
        .then((ticket) =>{
        res.redirect('/tickets/')
        })
    .catch(console.error)
})

// [] delete route
router.delete('/tickets/:id', (req,res) =>{
    let id = req.params.id
    Tickets.findOneAndRemove({_id : id})
    .then(ticket =>{
        console.log(ticket, `This Ticket was deleted ${ticket} `)
        res.redirect('/tickets/')
    })
})
// search bar route
router.get('/show', (req,res)=>{
    console.log(req.query)
    let id = req.query.ticket
    Tickets.findById(id )
    .then((ticket) =>{
       res.render('searchbar', {ticket : ticket})
})})

router.get('/about', (req,res) =>{
    res.render('about')
})



module.exports = router