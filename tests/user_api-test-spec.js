/**
 * Created by trost on 26/08/16.
 */
'use strict';

const config = require('../config');

const frisby = require('frisby');
const url_stub = `${config.domain}:${config.port}`;

const testuser = {
    user: 'testuser',
    pwd: 'tpw123'
};

frisby.create('Get restricted page, no token')
    .get(url_stub + '/restricted')
    .expectStatus(401)
    .toss();

frisby.create('Get open page')
    .get(url_stub + '/hello')
    .expectStatus(200)
    .toss();

frisby.create('Post register success')
    .post(url_stub + '/user', {
        user: testuser.user,
        pwd: testuser.pwd
    }, { json: true })
    .expectStatus(200)
    .expectJSONTypes('', {
        auth_token: String
    })
    .toss();

frisby.create('Post register fail; user already registered')
    .post(url_stub + '/user',{
        user: testuser.user,
        pwd: testuser.pwd
    }, { json: true })
    .expectStatus(401)
    .toss();

frisby.create('Post login fail')
    .post(url_stub + '/login', {
        user: 'stefan',
        pwd: '1111'
    }, { json: true })
    .expectStatus(401)
    .toss();

frisby.create('Post login success')
    .post(url_stub + '/login', {
        user: testuser.user,
        pwd: testuser.pwd
    }, { json: true })
    .expectStatus(200)
    .expectJSONTypes('', {
        auth_token: String
    })
    .toss();

frisby.create('Delete user')
    .delete(url_stub + '/user', {
        user: testuser.user,
        pwd: testuser.pwd
    }, {json: true})
    .expectStatus(200)
    .toss();
