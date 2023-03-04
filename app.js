const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT;
require("./db/conn");

const User = require("./models/schema_file");
const authenticate = require("./middleware/Authenticate");
app.use(express.json());
app.use(cookieParser());

app.get('/',(req,res)=>{
  res.send("Hello from server");
})
app.post("/registers", async (req, res) => {
  const { name, email, number, password, cpassword } = req.body;
  if (!name || !email || !number || !password || !cpassword) {
    return res.status(422).json({ error: "Filled the fields properly" });
  }
  try {
    const emailexits = await User.findOne({ email });
    if (emailexits) {
      return res.status(422).json({ error: "User email alerady exists" });
    }
    const userdata = new User({
      name,
      email,  
      number,
      password,
      cpassword,
    });
    const response = await userdata.save();
    if (response) {
      res.status(201).json({ message: "User succesfully registered" });
    } else {
      return res.status(422).json({
        error: "some problem is there user not able to complete registration",
      });
    }
  } catch (error) {
    return console.log(error);
  }
});

// login route
let token;
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "Please filled data" });
    }
    const emailfind = await User.findOne({ email: email });
    if (emailfind) {
      const isMatch = await bcrypt.compare(password, emailfind.password);
      token = await emailfind.generateAuthToken();
      console.log("Token generated : "+token);  

      res.cookie("mycookie",token,{
        expires:new Date(Date.now()+2589920000),
        httpOnly:true,
      });
     
      
      if (!isMatch) {
        res.status(400).json({ error: "invalid credentials okk..." });
      } else {
        res.status(200).json({ meseege: "Login succesfully" });
      }
    } else {
      res.status(400).json({ error: "invalid credentials..." });
    }
  } catch (error) {
    console.log(error);
  }
});

app.get("/services", authenticate, (req, res) => {
  console.log("hello my services");
  res.send(req.rootUser);
});

app.get("/logout", (req, res) => {
  console.log("logout");
  res.clearCookie("mycookie", { path: "/" });
  res.status(200).send("user logout");
});

app.listen(PORT, () => {
  console.log(`Listening to the port ${PORT}`);
});
