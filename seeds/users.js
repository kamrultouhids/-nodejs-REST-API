var bcrypt = require('bcryptjs');

exports.seed = function (knex, Promise) {
    return knex('users').truncate().then(function () {
        return knex('users').insert([
            { name: 'Admin', email: 'admin@gmail.com', password: bcrypt.hashSync('123', 8)},
            { name: 'User', email: 'user@gmail.com', password: bcrypt.hashSync('123', 8)},
        ]);
    });
};
