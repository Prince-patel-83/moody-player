require("dotenv").config();

const app = require("./src/app.js");
const connectToDB = require("./src/db/db.js")

connectToDB();

app.listen(3000, ()=>{
    console.log("server is runnung on port 3000");
})