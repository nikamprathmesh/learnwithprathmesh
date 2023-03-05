const mongoose = require("mongoose");
const DATABASE = process.env.DATABASE;
mongoose
  .connect(DATABASE)
  .then(() => {
    console.log("connection succesfull");
  })
  .catch((err) => {
    console.log("Connection Failed");
  });
