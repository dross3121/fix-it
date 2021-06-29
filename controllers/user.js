const express = require('express')
const router = express.Router()
const User = require('../models/user-model')
const passport = require('passport');
const bcrypt = require('bcrypt');

// user sign in page
router.get('/signin',(req, res, next) => {
    res.render('signin');
  });


  router.post('/signin',
  passport.authenticate('local',{
          successRedirect: '/success',
          failureRedirect: '/signin' 
}))


router.get('/registration',  (req,res) =>{
      res.render('registration')
})

// success log route 
router.get('/success', (req,res) =>{
    res.render('success')
})  

router.post('/registration', (req,res, next) =>{
    bcrypt.hash (req.body.password, 10,(err, hash) =>{
        let newUser = {
            name: req.body.name,
            password: hash
        }
        User.create(newUser)
        .then(user => {
            console.log(user)
            res.redirect('/success')
        })
        .catch(console.error);

        })
    })



  
// all users route
router.get('/tickets/user', (req,res) =>{
    User.find({})
    .then((user) =>{
        res.json(user)
    })
    .catch(console.log(error))
})

// get usr by id route
router.get('/tickets/user/:id', (req,res) =>{
    var id = req.params.id
    User.findById(id)
    .then(userId =>{
        res.json(userId)
    })
})

module.exports = router