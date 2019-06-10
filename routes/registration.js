var express = require('express');
var router = express.Router();
var authenticate = require('../middlewares/authenticate');
var jwtconfig = require('../jwtconfig');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
let Validator = require('validatorjs');
const knex = require('knex')(require('../knexfile')[process.env.NODE_ENV]);

router.post('/', async(req, res) => {
    let validation = new Validator(req.body, {
        name: 'required',
        email: 'required|email',
        password: 'required|confirmed|min:6',
        password_confirmation: 'required|min:6',
    },{
        "required.email": "The email field is required!",
        "email.email": "The email must be a valid email address!",
    });

    const { name, email, password } = req.body;
    let result = await knex('users').where('email',email);

    let uniqueValidationFails = false;
    if (result.length > 0) {
        uniqueValidationFails = true;
    }

    if (validation.fails() || uniqueValidationFails) {
        if (uniqueValidationFails) {
            validation.errors.errors['email'] = ["Email field must be unique."];
        }
        return res.json({code: 422, message: validation.errors.all(), data: null});
    }

    let hashedPassword = bcrypt.hashSync(password, 8);
    knex('users').insert({
        name: name,
        email: email,
        password: hashedPassword
    }).then(response => {
        var token = jwt.sign({id: response}, jwtconfig.JWT_SECRET, {
            expiresIn: jwtconfig.JWT_EXPIRES
        });
        return res.json({code: 200, message: 'success', data: {token}});
    }).catch(error => {
        if (error.errno == 1062) {
            return res.json({code: 400, message: 'User email must be unique.', data: null});
        }
        return res.json({code: 400, message: 'something error found, please try again.', data: null});
    })

});

module.exports = router;
