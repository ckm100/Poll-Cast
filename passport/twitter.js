var TwitterStrategy = require("passport-twitter").Strategy;

module.exports = function (passport, Users) {

    passport.use(new TwitterStrategy({
            consumerKey: "RQT7X8nn9iCj7nEu5LUo19LIr",
            consumerSecret: "UctazcMxMiUJpOUPuCYzWLu1nKQW9G969xF84OOnSUyjspygRF",
            callbackURL: "http://pollcast.heroku.com/auth/twitter/callback"
        },
        function (token, tokenSecret, profile, done) {

            Users.findOne({
                twitterId: profile.id
            }, function (err, user) {
                if (err) {

                    return done(err);

                } else {

                    if (user) {

                        done(null, user);

                    } else {

                        var user = new Users({

                            uname: profile.displayName.split(" ")[0],
                            twitterId: profile.id

                        });

                        user.save(function (err, data) {

                            if (err) {

                                return done(err)

                            } else {

                                return done(null, user);

                            }

                        });

                    }

                }

            });
        }
    ));

}
