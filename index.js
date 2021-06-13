const express = require('express')
const app = express()



app.get('/', (req,res) =>{
    res.send('Made it to home page')
})










app.set("port", process.env.PORT || 8000);

// listening on port
app.listen(app.get("port"), () => {
  console.log(`✅ PORT: ${app.get("port")} 🌟`);
});