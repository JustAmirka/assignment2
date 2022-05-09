var express = require("express");
require("mongoose");
const
    passport = require("passport"),
    bodyParser = require("body-parser"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose =
        require("passport-local-mongoose"),
    User = require("./models/user");
const ejs=require('ejs');
const app = express();


const port = 8000;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static('public'))




app.use("/accountRoute", require("./accountRoute.js"));


const dbConfig = require('./config/database.config.js');
let mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Databse Connected Successfully!!");
}).catch(err => {
    console.log('Could not connect to the database', err);
    process.exit();
});

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(require("express-session")({
    secret: "Rusty is a dog",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//<----------------------------------------------->


app.use("/", require("./root"));


app.use("/productDetail", require("./productDetail"));

app.use("/chanel", require("./Chanel"));

app.use("/bacPack", require("./bacPack"));

app.use("/manMix", require("./manMIx"));

app.use("/classicWatch", require("./classicWatch"));

app.use("/womanMix", require("./womanMix"));

app.use("/", require("./productMain"));
app.get("/secret", isLoggedIn, function (req, res) {
    res.render("secret");
});

// Showing register form
app.get("/register", function (req, res) {
    res.render("register");
});

app.post("/register", function (req, res) {
    var username = req.body.username
    var firstName = req.body.firstName
    var lastName = req.body.lastName
    var email = req.body.email
    var password = req.body.password
    User.register(new User({ email: email, firstName: firstName, lastName: lastName, username: username  }),
        password, function (err, user) {
            if (err) {
                console.log(err);
                return res.render("register");
            }

            passport.authenticate("local")(
                req, res, function () {
                    res.render("secret");
                });
        });
});



//------------------------------



//Showing login form
app.get("/login", function (req, res) {
    res.render("login");
});

//Handling user login
app.post("/login", passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
}), function (req, res) {
});

//Handling user logout
app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect("/login");
}

app.listen(port, () =>
    console.log(`App listening at http://localhost:${port}`)
);

