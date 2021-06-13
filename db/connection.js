const mongoose = require('mongoose')
 
const mongoURI = 
  process.env.NODE_ENV === 'production' 
  ? process.env.DB_URL 
  : 'mongodb://localhost/fix-it'
  
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  // The connect method is asynchronous, so we can use
  // .then/.catch to run callback functions
  // when the connection is opened or errors out.
  .then((instance) =>
    console.log(`Connected to db: ${instance.connections[0].name}`)
  )
  .catch((error) => console.log('Connection failed!', error));

// Export mongoose so we can use it elsewhere
module.exports = mongoose;
