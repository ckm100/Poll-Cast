var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    UserSchema;

UserSchema = new Schema({
    uname: String,
    uemail: String,
    upassword: String,
    twitterId: String,
    poll: [{
        pollName: String,
        pollLabel: [],
        pollValue: [],
        colors: [],
        highlights: []
    }]

});


module.exports = mongoose.model("Users", UserSchema);
