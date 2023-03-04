const mongoose = require("mongoose");
const DATABASE = process.env.DATABASE;
// const DATABASE = "mongodb+srv://prathmesh:prathmeshnikam@learnsitecluster.nwbg9cf.mongodb.net/useservice?retryWrites=true&w=majority";
mongoose
  .connect(DATABASE)
  .then(() => {
    console.log("connection succesfull");
  })
  .catch((err) => {
    console.log("Connection Failed");
  });
