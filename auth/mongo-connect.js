/**
 * Created by trost on 23/08/16.
 */
'use strict';

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const auth_config = require('./auth_config');

const url = auth_config.mongodb.url;

function connect(callback) {
    MongoClient.connect(url, callback);
}

function disconnect(db) {
    db.close();
    console.log('DB connection closed');
}

const Db = {};

Db.signupUser = function(id, pwd, userObject, errCallback, successCallback) {
    connect((err, db) => {
        assert.equal(null, err);
        console.log('Connected to mongodb to sign user up');

        const Users = db.collection('users');

        Users.find({ id }).limit(1).toArray((err, user) => {
            if (user.length) {
                errCallback();
                disconnect(db);

            } else {
                Users.insertOne(userObject, (err, result) => {
                    assert.equal(null, err);
                    assert.equal(1, result.insertedCount);

                    console.log('Inserted user ' + id);

                    successCallback();
                    disconnect(db);
                });
            }
        });
    });
};

Db.login = function (id, pwd, errCallback, successCallback) {
    connect((err, db) => {
        assert.equal(null, err);
        console.log('Connected to mongodb to log user in');

        const Users = db.collection('users');

        Users.find({ id, pwd }).limit(1).toArray((err, user) => {
            if (user.length) {
                console.log('User found');
                successCallback();
                disconnect(db);
            } else {
                console.log('No user found');
                errCallback();
                disconnect(db);
            }
        });
    });
};

Db.resetPwd = function (email, errCallback, successCallback) {
    connect((err, db) => {
        assert.equal(null, err);
        console.log('Connected to mongodb to send reset password mail');

        const Users = db.collection('users');

        Users.find({ id: email }).limit(1).toArray((err, user) => {
            if (user.length) {
                console.log('User found');
                successCallback();
                disconnect(db);
            } else {
                console.log('No user found');
                errCallback();
                disconnect(db);
            }
        });
    });
};

Db.verifyUser = function (idFromToken, errCallback, successCallback, failCallback) {
    connect((err, db) => {
        assert.equal(null, err);
        console.log('Connected to mongodb to verify user');

        const Users = db.collection('users');

        Users.find( { id: idFromToken }).limit(1).toArray((err, user) => {
            if (err) {
                console.log('An error occurred: ' + err);
                errCallback();
            }

            if (user.length) {
                console.log('User found');
                successCallback(user);
                disconnect(db);
            } else {
                console.log('No user found');
                failCallback();
                disconnect(db);
            }
        });
    });
};

Db.deleteUser = function (userId, pwd, errCallback, successCallback) {
    connect((err, db) => {
        assert.equal(null, err);
        console.log('Connected to mongodb to delete user');

        const Users = db.collection('users');

        Users.deleteOne( { id: userId, pwd}, (err, r) => {
            if (err) {
                errCallback(err);
                console.log(err);
                disconnect(db);
            }
            assert.equal(null, err);
            assert.equal(1, r.deletedCount);
            console.log(`User ${userId} deleted`);
            successCallback();
            disconnect(db);
        });
    });
};

module.exports = Db;