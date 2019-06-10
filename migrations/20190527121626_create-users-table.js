
exports.up = function(knex, Promise) {
    return knex.schema.createTable('users', function (table) {
        table.increments('id');
        table.string('name', 255).notNullable();
        table.string('email', 255).unique().notNullable();
        table.string('password', 255).notNullable();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable("users");
};
