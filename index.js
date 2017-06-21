var express= require("express");
var mongoose = require("mongoose");
bodyParser = require('body-parser'),
passport = require('passport'),
LocalStrategy = require('passport-local'),
passportLocalMongoose = require('passport-local-mongoose');
User = require("./models/user.js");
mongoose.connect("mongodb://localhost/auth");
var app = express();
app.set('view engine', 'ejs');
app.use(express.static("public"));

app.get("/", (req, res) =>{
    res.render("home");
});

app.get("/secret", (req, res)=> {
    res.render("secret");
});

app.listen(3000, 'localhost', ()=> console.log('Server is listening...'))