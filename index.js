/**
 * Created by trost on 22/08/16.
 */
'use strict';

const express = require('express');
const app = express();
const config = require('./config');
const passport = require('passport');

require('./auth/auth')(app, passport);

/**
 * Example route: requires authentication
 */
app.get('/restricted', passport.authenticate('jwt', {session: false}), (req, res) => {
    res.send('You are authenticated!');
});

/**
 * Example route: no authentication required
 */
app.get('/hello', (req, res) => {
    res.send('Hello World');
});

const port = config.port;
app.listen(port,  () => {
    console.warn(`Node/Express app listening on port ${port}`);
});

