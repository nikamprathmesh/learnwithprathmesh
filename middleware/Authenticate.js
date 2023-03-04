const jwt = require("jsonwebtoken");
const User = require("../models/schema_file");
const dotenv = require("dotenv");
dotenv.config({ path: "../config.env" });
const Authenticate = async (req, res, next) => {
  try {
    let token = req.cookies.mycookie;
      // verify the token
    const verfiyToken = jwt.verify(token, process.env.SECRET_KEY);
    const rootUser = await User.findOne({
      _id: verfiyToken._id,
      "tokens.token": token,
    });
    if (!rootUser) {
      throw new Error("user not find");
    }
    req.token = token;
    req.rootUser = rootUser;    
    req.userId = rootUser._id;
    next();
  } catch (error) {
    res.status(401).send("unauthorised token provided");
    console.log(error);
  }
};
module.exports = Authenticate;
