const express = require('express');
const methodOverride = require('method-override')
const app = express();
const mongoose = require('mongoose')
const Tickets = require('./models/tickets-model')
const User = require('./models/user-model')

const ticketsController = require('./controllers/tickets')
const usersController = require('./controllers/user')


// setting render templating as ejs
app.set('view engine', 'ejs');

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
app.use(ticketsController)
app.use(usersController)




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
// [X] re-factor routes
// [X] fix heroku 
// [] user login/ authentication
// passpor.js sessios docs
// [] rendering all of a users tickets based on id
// [] flash message for when picture is to large
// [] style.css or bootstrap
