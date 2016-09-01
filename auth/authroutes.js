/**
 * Created by trost on 31/08/16.
 */
'use strict';

const Db = require('./mongo-connect');

const auth_config = require('./auth_config');

const jwt = require('jwt-simple');
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt_alg = 'HS256';
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromUrlQueryParameter('auth_token');
opts.secretOrKey = auth_config.secret;

exports.login = (req, res) => {
    const userId = req.body.user;
    const pwd = req.body.pwd;

    function err() {
        res.sendStatus(401);
    }

    function success() {
        const token = jwt.encode(userId, opts.secretOrKey, jwt_alg, opts);
        res.json({auth_token: token});
    }

    if (validateUser(userId)) {
        Db.login(userId, pwd, err, success);
    } else {
        return err();
    }

    function validateUser(input) {
        // todo sanity checks for user input!!!
        if (input === '') {
            return false;
        } else {
            return true;
        }
    }

};

exports.signup = (req, res) => {
    // check if user id available, retry if not.
    const userId = req.body.user;
    const pwd = req.body.pwd;
    const userObject = {
        id: userId,
        pwd
    };

    function err() {
        res.send('Your email is already taken. Please login or retrieve you password.');
    }

    function success() {
        const token = jwt.encode(userId, opts.secretOrKey, jwt_alg, opts);
        res.json({ auth_token: token });
    }

    if (validateUser(userId)) {
        Db.signupUser(userId, pwd, userObject, err, success);
    } else {
        return err();
    }

    function validateUser(input) {
        // todo sanity checks for user input!!!
        if (input === '') {
            return false;
        } else {
            return true;
        }
    }

};

exports.getResetpassword = (req, res) => {
    const userId = req.body.user;

    function err() {
        res.send('We\'ve sent you an email with a link to set your new password.');
    }

    function success() {
        // todo create token for url
        // todo send email with url
        res.send('We\'ve sent you an email with a link to set your new password.');
    }

    if (validateUser(userId)) {
        Db.resetPwd(userId, err, success);
    } else {
        return err();
    }

    function validateUser(input) {
        // todo sanity checks for user input!!!
        if (input === '') {
            return false;
        } else {
            return true;
        }
    }

};

exports.postResetpassword = (req, res) => {
    // todo
    // const pwd = req.body.pwd;
    res.sendStatus(200);
};

exports.deleteUser = (req, res) => {
    const userId = req.body.user;
    const pwd = req.body.pwd;

    function success() {
        res.sendStatus(200);
    }

    function err(err) {
        res.send(err);
    }

    function validateUser(input) {
        // todo sanity checks for user input!!!
        if (input === '') {
            return false;
        } else {
            return true;
        }
    }

    if (validateUser(userId)) {
        Db.deleteUser(userId, pwd, err, success);
    } else {
        err();
    }
};

