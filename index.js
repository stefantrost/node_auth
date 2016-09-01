/**
 * Created by trost on 22/08/16.
 */
'use strict';

const express = require('express');
const app = express();
const config = require('./config');
const passport = require('passport');

require('./auth/auth')(app, passport);


app.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    res.send('You are authenticated!');
});

app.get('/hello/:param', (req, res) => {
    res.send(`Hello ${req.params.param}`)
});

const port = config.port;
app.listen(port,  () => {
    console.warn(`Node/Express app listening on port ${port}`);
});

