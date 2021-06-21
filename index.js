const express = require('express');
const methodOverride = require('method-override')
const app = express();
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const Tickets = require('./models/tickets-model')
const User = require('./models/user-model')
require('dotenv/config');


// setting render templating as ejs
app.set('view engine', 'ejs');

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))










// stroage path for uploaded photos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
const upload = multer({ storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    } });
    
    // [X]show/read route working
app.get('/tickets/', (req, res) => {
        Tickets.find({})
        .populate('owner')
        .then((tickets) =>{
            console.log(tickets)
            res.render('index', {tickets : tickets})
        })
        .catch(console.error);
    });

// all users route
app.get('/tickets/users', (req,res) =>{
    User.find({})
    .then((users) =>{
        res.json(users)
    })

})


// add /new route for this form to create new tickets 
app.get('/tickets/new/', (req,res) =>{
    res.render('new')
})
app.post('/tickets/', upload.single('image'), (req, res, next) => {
    let newTicket = {
        title: req.body.title,
        desc: req.body.desc,
        offer: req.body.offer,
        img: {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            contentType: 'image/png'
        }
    }
    Tickets.create(newTicket)
    .then(ticket => {
        console.log(ticket)
        res.redirect('/tickets')
    })
    .catch(console.error);
});

// get one ticket by id route
app.get('/tickets/:id', (req,res) =>{
    let id = req.params.id
    Tickets.findById(id)
    .populate('owner')
    .then((ticket) =>{
       res.render('show', {ticket : ticket})
    })
    .catch(console.error);
})



// get usr by id route
app.get('/tickets/users/:id', (req,res) =>{
    var id = req.params.id
    User.findOne({_id : id})
    .then(userId =>{
        res.json(userId)
    })
})

// [x] grab a ticket by id tand render to the PUT to update

var myTicket;
app.get('/tickets/:id/edit', (req,res) =>{
    let id = req.params.id
    console.log(id)
    Tickets.findById(id)
    .then((ticket) =>{
        myTicket = ticket
        console.log(myTicket)
       res.render('edit', {ticket : ticket})
    })
})

// [X]  update route
app.put('/tickets/:id', upload.single('image'),(req,res, next) =>{
    let id = req.params.id
    let filename;
    Tickets.findOneAndUpdate(
        {_id : id},
        {
            title: req.body.title,
            desc: req.body.desc,
            offer: req.body.offer,
            img: filename = {data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
                contentType: 'image/png'}
        },
        {new : true}
        )
        .then((ticket) =>{
            console.log(ticket)
       res.render('show', {ticket : ticket})
        })
    .catch(console.error)
})

// [] delete route
app.delete('/tickets/:id', (req,res) =>{
    let id = req.params.id
    Tickets.findOneAndRemove({_id : id})
    .then(ticket =>{
        console.log(ticket, `This Ticket was deleted ${ticket} `)
        res.redirect('/tickets/')
    })
})


app.use((err, req, res, next) => {
    const statusCode = res.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).send(message);
  });



app.set("port", process.env.PORT || 8000);

// listening on port
app.listen(app.get("port"), () => {
    console.log(`✅ PORT: ${app.get("port")} 🌟`);
});

// TODOs
// [x] finsh put and delete route
// [X] connect user and tickets in database
// [] re-factor routes
// [] user login/ authentication
// [] rendering all of a users tickets based on id
// [] flash message for when picture is to large
// [] style.css or bootstrap
// [X] fix heroku 
