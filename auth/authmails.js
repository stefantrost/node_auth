/**
 * Created by trost on 31/08/16.
 */
const auth_config = require('./auth_config');
const config = require('../config');
const sendgrid = require('sendgrid')(auth_config.sendgrid.apikey);

function sendMail(request) {
    "use strict";
    sendgrid.API(request)
        .then(response => {
            console.log(response.statusCode);
        })
        .catch(error => {
            //error is an instance of SendGridError
            //The full response is attached to error.response
            console.log(error.response.statusCode);
        });
}

exports.sendResetPasswordMail = function (to, token) {
    sendMail(sendgrid.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: {
            personalizations: [
                {
                    to: [
                        {
                            email: to
                        }
                    ],
                    subject: 'You have requested a new password.'
                }
            ],
            from: {
                email: auth_config.sendgrid.from
            },
            content: [
                {
                    type: 'text/html',
                    value: `Hello,\n\n to set a new password, click on the link:\n<a href="${config.url}:${config.port}/resetpassword?${token}">reset password</a>`
                }
            ]
        }
    }));
};