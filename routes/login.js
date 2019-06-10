var express = require('express');
var router = express.Router();
var authenticate = require('../middlewares/authenticate');
var jwtconfig = require('../jwtconfig');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
let Validator = require('validatorjs');
const knex = require('knex')(require('../knexfile')[process.env.NODE_ENV]);

router.post('/', (req, res) => {
    let validation = new Validator(req.body, {
        email: 'required|email',
        password: 'required',
    },{
        "required.email": "The email field is required!",
        "email.email": "The email must be a valid email address!",
    });

    if (validation.fails()) {
        return res.json({code: 422, message: validation.errors.all(), data: null});
    }

    const { email, password } = req.body;
    knex('users').where('email', email).then(response => {
        if (response.length > 0 && bcrypt.compareSync(password, response[0].password)) {
            var token = jwt.sign({id: response[0].id}, jwtconfig.JWT_SECRET, {
                expiresIn: jwtconfig.JWT_EXPIRES
            });
            return res.json({code: 200, message: 'success', data: {token}});
        } else {
            return res.json({code: 400, message: 'Invalid Credentials', data: null});
        }
    }).catch(error => {
        return res.json({code: 400, message: 'something error found, please try again.', data: null});
    });
});

module.exports = router;
