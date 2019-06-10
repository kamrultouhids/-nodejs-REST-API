var jwt = require('jsonwebtoken');
var config = require('../jwtconfig');
const knex = require('knex')(require('../knexfile')[process.env.NODE_ENV]);

function authenticate(req, res, next) {
	const authorizationHeader = req.headers['authorization'];
    let token;
    if(authorizationHeader) {
        token = authorizationHeader.split(' ')[1];
    }
    if(token) {
        jwt.verify(token, config.JWT_SECRET, (err, decode)=> {
            if(err) {
                return res.json({ code: 400, message: 'Failed to authenticate !', data: null});
            } else {
                knex('users').where('id', decode.id).then(response => {
                    if(response.length > 0) {
                        next();
                    } else {
                        return res.json({ code: 400, message: 'Invalid Credentials !', data: null});
                    }
                }).catch(error => {
                    return res.json({ code: 400, message: 'Invalid Credentials !', data: null});
                });
			}
		});
    } else {
        return res.json({ code: 400, message: 'No token provided !', data: null});
    }
}

module.exports = authenticate;