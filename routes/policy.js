const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");


router.get("/contactus", (req, res) => {
    res.render("policy/contactus.ejs");
  });
router.get("/Privacy", (req, res) => {
    res.render("policy/privacy.ejs");
  });
router.get("/terms", (req, res) => {
    res.render("policy/terms.ejs");
  });
router.get("/refunds",(req, res)=>{
    res.render("policy/refunds.ejs");
  });
router.get("/disclaimer", (req, res)=>{
    res.render("policy/dis.ejs");
  });

module.exports = router; 