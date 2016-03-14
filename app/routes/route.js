module.exports = function (app, passport, Users) {

    app.get("/logout", function (req, res) {

        req.logout();

        res.redirect("/");

    });

    app.get('/auth/twitter', passport.authenticate('twitter'));

    app.get("/auth/twitter/callback", function (req, res, next) {

        passport.authenticate("twitter", function (err, user, info) {

            if (err) {

                res.end("Something went wrong please try logging in again, if problem persist you can please contact me at kufogbemawuli1@gmail.com");
            }

            if (!user) {

                res.end("Something went wrong please try logging in again, if problem persist you can please contact me at kufogbemawuli1@gmail.com");

            } else {

                req.login(user, function (err) {

                    if (err) {

                        res.end("Something went wrong please try logging in again, if problem persist you can please contact me at kufogbemawuli1@gmail.com");

                    } else {

                        res.redirect("/pollboard");

                    }

                });
            }

        })(req, res, next);

    });


    app.get("/:userId/:pollId", function (req, res, next) {

        var userId = req.params.userId,
            pollId = req.params.pollId;

        if (req.isAuthenticated()) {

            Users.findOne({
                _id: userId
            }, function (err, doc) {

                if (err) {

                    res.status(500).send({
                        error: "Sorry the page you requiring for does not exist"
                    });

                } else {

                    if (req.user._id.toString() === userId) {

                        res.render("poll", {
                            auth: true,
                            isUserLoginShare: true,
                            userId: userId,
                            luser: req.user.uname,
                            pollAuthor: "You",
                            pollData: doc.poll.id(pollId)

                        });

                    } else {

                        res.render("poll", {
                            auth: true,
                            isUserLoginShare: true,
                            userId: userId,
                            luser: req.user.uname,
                            pollAuthor: doc.uname,
                            pollData: doc.poll.id(pollId)

                        });

                    }

                }

            });

        } else {

            Users.findOne({
                _id: userId
            }, function (err, doc) {

                if (err) {

                    res.status(500).send({
                        error: "Sorry the page you requiring for does not exist"
                    });

                } else {

                    res.render("poll", {
                        auth: false,
                        isUserLoginShare: false,
                        userId: userId,
                        luser: "",
                        pollAuthor: doc.uname,
                        pollData: doc.poll.id(pollId)

                    });

                }

            });

        }

    });

    app.get("/", function (req, res, next) {

        if (req.isAuthenticated()) {

            Users.find({}, function (err, data) {

                if (err) {

                    res.end('Internal Server Error, please try again. If you keep encountering the problem, you can please contact me at kufogbemawuli1@gmail.com');

                } else {

                    if (data.length === 0) {

                        res.render("index", {
                            poll: 0,
                            auth: true,
                            luser: req.user.uname
                        });

                        res.end();

                    } else {

                        res.render("index", {
                            poll: data.length,
                            auth: true,
                            luser: req.user.uname,
                            allPoll: data,
                            activeUser: req.user._id.toString()
                        });

                        res.end();

                    }

                }

            });

        } else {

            Users.find({}, function (err, data) {

                if (err) {

                    res.end('Internal Server Error, please try again. If you keep encountering the problem, you can please contact me at kufogbemawuli1@gmail.com');

                } else {

                    if (data.length === 0) {

                        res.render("index", {
                            poll: 0,
                            auth: false
                        });

                        res.end();

                    } else {

                        res.render("index", {
                            poll: data.length,
                            auth: false,
                            luser: "",
                            allPoll: data
                        });

                        res.end();

                    }

                }

            });

        }

    });

    app.get("/pollboard", function (req, res) {

        if (req.isAuthenticated()) {

            Users.findOne({

                _id: req.user._id

            }, function (err, data) {

                if (err) {

                    res.end('Internal Server Error, please try again. If you keep encountering the problem, you can please contact me at kufogbemawuli1@gmail.com');

                } else {

                    if (data.poll.length === 0) {

                        res.render("pollboard", {
                            poll: 0,
                            luser: req.user.uname
                        });

                        res.end();

                    } else {

                        res.render("pollboard", {
                            poll: data.poll.length,
                            luser: req.user.uname,
                            pollData: data.poll,
                            userId: data._id
                        });

                        res.end();

                    }
                }

            });


        } else {

            res.redirect("/");

        }

    });


    app.post('/login', function (req, res, next) {

        passport.authenticate('login', function (err, user, info) {

            if (err) {

                return next(err);
            }

            if (!user) {

                var er = req.flash("message")[0];

                res.json({
                    error: er
                });

            } else {

                req.login(user, function (err) {

                    if (err) {

                        return next(err);

                    } else {

                        res.redirect("/pollboard");

                    }

                });
            }

        })(req, res, next);

    });

    app.post('/signup', function (req, res, next) {

        passport.authenticate('signup', function (err, user, info) {

            if (err) {
                return next(err);
            }
            if (!user) {

                var er = req.flash("message")[0];

                res.json({
                    error: er
                });

            } else {

                req.login(user, function (err) {

                    if (err) {

                        return next(err);

                    } else {

                        res.redirect("/pollboard");

                    }

                });

            }

        })(req, res, next);

    });

    app.post("/addPoll", function (req, res, next) {

        Users.findOne({
            _id: req.user._id
        }, function (err, doc) {

            if (err) {

                return next(err);

            } else {

                doc.poll.push({

                    pollName: req.body.title,
                    pollLabel: req.body["label[]"],
                    pollValue: req.body["value[]"],
                    colors: req.body["color[]"],
                    highlights: req.body["highlight[]"]

                });

                doc.save(function (err, data) {

                    if (err) {

                        return next(err);

                    } else {

                        res.json({
                            success: true
                        });

                        res.end();

                    }

                });

            }

        });

    });

    app.post("/vote", function (req, res, next) {

        Users.findOne({
            _id: req.body.userId
        }, function (err, data) {

            if (err) {

                return next(err);

            } else {

                data.poll.forEach(function (val) {

                    if (val._id.toString() === req.body.pollId) {

                        val.pollValue.splice(val.pollLabel.indexOf(req.body.label), 1);
                        val.pollValue.splice(val.pollLabel.indexOf(req.body.label), 0, req.body.vote);

                    }

                });

                data.save(function (err) {

                    if (err) {

                        return next(err);

                    } else {

                        res.json({
                            success: true
                        })

                        res.end();

                    }

                });
            }

        });

    });

    app.post("/deletePoll", function (req, res, next) {

        Users.findOne({
            _id: req.body.userId
        }, function (err, data) {

            if (err) {

                return next(err);

            } else {

                data.poll.id(req.body.pollId).remove();

                data.save(function (err) {

                    if (err) {

                        return next(err);

                    } else {

                        res.end();

                    }

                });

            }

        });

    });

}
