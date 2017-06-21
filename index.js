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
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(passport.initialize());
app.use(passport.session());
app.use(require("express-session")({
    secret: 'Javascript can be strange!',
    resave: false,
    saveUninitialized: false,
}))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", (req, res) =>{
    res.render("home");
});

app.get("/secret", (req, res)=> {
    res.render("secret");
});
app.get("/register", (req, res) => {
    res.render("register");
});
app.post("/register", (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    User.register(new User({username: username}), password,(err, user) => {
        if(err){
            console.log(err);
            res.redirect("/");
        }else{
            passport.authenticate("local")(req, res, function() {
                res.redirect("/secret");
            });
        }
    });
   
});

app.listen(3000, 'localhost', ()=> console.log('Server is listening...'))