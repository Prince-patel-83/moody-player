const dotenv = require("dotenv");
dotenv.config();
const app = require("./src/app.js");
const connectToDB = require("./src/db/db.js")
const PORT = process.env.PORT || 3000;

connectToDB();

app.listen(PORT, ()=>{
    console.log(`server is running on port ${PORT}`);
})
