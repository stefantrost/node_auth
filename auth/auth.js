/**
 * Created by trost on 31/08/16.
 */
module.exports = function(app, passport) {
    'use strict';

    const Db = require('./mongo-connect');
    const routes = require('./authroutes');
    const auth_config = require('./auth_config');

    /*
     * Body parser
     */
    const bodyParser = require('body-parser');

    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({extended: false}));

    // parse application/json
    app.use(bodyParser.json());


    /*
     * Passport strategy JWT
     */
    const JwtStrategy = require('passport-jwt').Strategy;
    const jwt = require('jwt-simple');
    const ExtractJwt = require('passport-jwt').ExtractJwt;
    const opts = {};
    opts.jwtFromRequest = ExtractJwt.fromUrlQueryParameter('auth_token');
    opts.secretOrKey = auth_config.secret;

    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        const idFromToken = jwt_payload.replace(/<.>/g);

        function err() {
            done(err, false);
        }

        function fail() {
            done(null, false);
        }

        function success(user) {
            done(null, user);
        }

        Db.verifyUser(idFromToken, err, success, fail);
    }));

    /*
     * Auth routes
     */

    app.post('/login', routes.login);

    app.post('/user', routes.signup);

    app.delete('/user', routes.deleteUser);

    app.post('/resetpassword', routes.postResetpassword);

};
