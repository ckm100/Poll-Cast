var express = require("express"),
    path = require("path"),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    passport = require("passport"),
    cookieParser = require("cookie-parser"),
    session = require("express-session"),
    routes = require("./app/routes/route"),
    passportLogic = require("./passport/index"),
    flash = require("connect-flash"),
    app = express(),
    Users = require("./model/index"),
    localDB = "mongodb://127.0.0.1:27017/poll";

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.set("port", (process.env.PORT || 3000));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(session({
    secret: "fuck you",
    resave: true,
    saveUninitialized: true

}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

mongoose.connect(process.env.MONGOLAB_URI || localDB);

passportLogic(Users);

routes(app, passport, Users);

app.listen(app.get("port"), function () {

    console.log("Listening to port " + app.get("port"));

});
