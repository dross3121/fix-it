const ticketData = require('./ticket-seed.json')

const Tickets = require('../models/tickets-model')
const User = require('../models/user-model')

// Remove any preexisting data
Tickets.deleteMany({})
  .then(() => User.deleteMany({}))
  .then(() =>{
    // Insert the dummy data and return it
    // so we can log it in the next .then
    return User.create({email: 'Dummyemail@yahoo.com', name: 'Tom From Myspace', phone: 4202201234})
    .then((user) =>
    Tickets.map((ticket) => ({...tickets, owner: user._id}))
    )
    .then((tickets) => Tickets.insertMany(tickets))
  })
  // If the insert was successful, we'll see the
  // results in the terminal
  .then(console.log)
  // Log the error if the insert didn't work
  .catch(console.error)
  // Whether it was successful or not, we need to 
  // exit the database.
  .finally(() => {
    // Close the connection to Mongo
    process.exit();
  });