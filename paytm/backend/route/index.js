const UserRoute=require("./user");
const express=require("express");
const router=express.Router();
const AccountRoute=require("./account")
router.use("/user",UserRoute);
router.use("/account",AccountRoute);


module.exports={router}