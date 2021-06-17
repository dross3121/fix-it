const express = require('express');
const methodOverride = require('method-override')
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const Tickets = require('./models/tickets-model')
require('dotenv/config');


// setting render templating as ejs
app.set('view engine', 'ejs');

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: false }))






// [X]show/read route working
app.get('/tickets/', (req, res) => {
    Tickets.find({})
    .then((tickets) =>{
        console.log(tickets)
        res.render('index', {tickets : tickets})
    })
    .catch(console.error);
});


// [x]create/post route 
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
    console.log(id)
    Tickets.findById(id)
    .then((ticket) =>{
       res.render('show', {ticket : ticket})
    })
    .catch(console.error);
})

// [x] grab a ticket by id tand render to the PUT to update
app.get('/tickets/:id/edit', (req,res) =>{
    let id = req.params.id
    console.log(id)
    Tickets.findById(id)
    .then((ticket) =>{
       res.render('edit', {ticket : ticket})
    })
})

// []  route
app.put('/tickets/:id', (req,res) =>{
    let id = req.params.id
    let filename = req.body.img
    console.log(id)
    Tickets.findOneAndUpdate(
        {_id : id},
        {
            title: req.body.title,
            desc: req.body.desc,
            offer: req.body.offer,
            // [] need to figure why it sayig path name undefined
            // return to show route
            img: {
                data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
                contentType: 'image/png'
                }, 
        },
        {new : true}
        )
        .then((ticket) =>{
       res.render('show', {ticket : ticket})
        })
    .catch(console.error)
})





app.set("port", process.env.PORT || 8000);

// listening on port
app.listen(app.get("port"), () => {
    console.log(`✅ PORT: ${app.get("port")} 🌟`);
});

// TODOs
// [] finsh put and delete route
// [] flash message for when picture is to large
// [] connect user and tickets in database
// [] style.css or bootstrap
// [] fix heroku 
// [] re-factor routes
// [] user login/ authentication
// [] rendering all of a users tickets based on id
// [] 