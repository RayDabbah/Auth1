var express= require("express");
var mongoose = require("mongoose"),
bodyParser = require('body-parser'),
passport = require('passport'),
LocalStrategy = require('passport-local'),
passportLocalMongoose = require('passport-local-mongoose');
User = require("./models/user");

mongoose.connect("mongodb://localhost/auth");
var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(require("express-session")({
    secret: 'Javascript can be strange! gjkhguyff hhhrss',
    resave: false,
    saveUninitialized: false,
}));
 app.use(express.static("public"));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

// middleware for authenticaton
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
     res.redirect("/login");
}
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", (req, res) =>{
    res.render("home");
});

app.get("/secret",isLoggedIn, (req, res)=> {
    res.render("secret");
});

// =======================
//         SIGNUP
// =======================
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
// ==================
//     LOGIN
// ==================
app.get("/login", (req, res) => {
    res.render("login");
});
app.post("/login", passport.authenticate('local', {
    successRedirect: "/secret",
    failureRedirect: "/login",
}), (req, res) => {
    res.send("Hi POST!");
});
// ===============
//     LOG OUT
// ===============
app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

app.listen(3000, 'localhost', ()=> console.log('Server is listening...'));
