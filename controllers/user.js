const express = require('express')
const router = express.Router()
const User = require('../models/user-model')



// user sign in page
router.get('/signin', (req, res, next) => {
    res.render('signin');
  });
router.post('/signin', (req, res, next) =>{
  passport.authenticate('local', {
      successRedirect: '/tickets',
      failureRedirect: '/signin'
  })
  (req, res, next);
  });

  
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