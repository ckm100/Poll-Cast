var bCrypt = require("bcrypt-nodejs");

module.exports = function (passport, LocalStrategy, Users) {

    passport.use("signup", new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, function (req, email, password, done) {

        var createHash = function (password) {
            return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
        }

        Users.findOne({
            "uemail": email
        }, function (err, email) {

            if (err) {
                return done(err);
            }

            if (email) {
                return done(null, false, req.flash("message", "0"))
            } else {

                var user = new Users({
                    uname: req.body.uname,
                    uemail: req.body.email,
                    upassword: createHash(password)
                });

                user.save(function (err) {

                    if (err) {

                        return done(err);

                    } else {

                        return done(null, user);

                    }

                });
            }

        });

    }));

}
