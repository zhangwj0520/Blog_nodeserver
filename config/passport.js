const { ExtractJwt, Strategy } = require('passport-jwt');
const mongoose = require('mongoose');
const User = mongoose.model('Blog_User');

const { secretOrkey } = require('../config/config');
const { to } = require('../utils/utils');

module.exports = function(passport) {
    var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = secretOrkey;

    passport.use(
        new Strategy(opts, async function(jwt_payload, done) {
            let err, user;
            [err, user] = await to(User.findById(jwt_payload.id));
            if (err) return done(err, false);
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        })
    );
};
