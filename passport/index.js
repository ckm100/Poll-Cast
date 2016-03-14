var passport = require("passport"),
    LocalStrategy = require("passport-local").Strategy,
    pLoginLogic = require("./login"),
    pSignUpLogic = require("./signup"),
    pTwitterLogic = require("./twitter");

module.exports = function (Users, app, bodyParser) {

    pLoginLogic(passport, LocalStrategy, Users);

    pSignUpLogic(passport, LocalStrategy, Users);

    pTwitterLogic(passport, Users);

    passport.serializeUser(function (user, done) {

        done(null, user._id);

    });

    passport.deserializeUser(function (id, done) {

        Users.findById(id, function (err, user) {

            done(err, user);

        });

    });

}
