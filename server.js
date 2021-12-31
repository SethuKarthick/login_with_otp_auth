require("dotenv/config");
const mongoose = require("mongoose");
const app = require("./app")

mongoose.connect(process.env.db_url, {})
    .then(() => console.log("db connected"))
    .catch((err) => console.log("db connection failed"));


    
const port =  process.env.PORT || 3001;

app.listen(port, ()=>{
    console.log(`app running on port ${port}!`)
})