const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const Tickets = require('./models/tickets-model')
require('dotenv/config');


// settign render templating as ejs
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// stroage path for uploaded photos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
const upload = multer({ storage: storage });


// app.get('/', (req,res) =>{
//     res.send('Made it to home page')
// })

app.get('/', (req, res) => {
    Tickets.find({}, (err, items) => {
        if (err) {
            console.log(err);
            res.status(status).send(body);
        }
        else {
            res.render('show', { items: items });
        }
    });
});
// add /new route for this form to create new tickets 
app.post('/', upload.single('image'), (req, res, next) => {
    const obj = {
        title: req.body.title,
        desc: req.body.desc,
        offer: req.body.offer,
        img: {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            contentType: 'image/png'
        }
    }
    Tickets.create(obj, (err, item) => {
        if (err) {
            console.log(err);
        }
        else {
            // item.save();
            res.redirect('/');
        }
    });
});








app.set("port", process.env.PORT || 8000);

// listening on port
app.listen(app.get("port"), () => {
  console.log(`✅ PORT: ${app.get("port")} 🌟`);
});