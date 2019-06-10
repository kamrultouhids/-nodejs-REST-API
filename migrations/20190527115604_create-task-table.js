
exports.up = function(knex, Promise) {
    return knex.schema.createTable('tasks', function (table) {
        table.increments('id');
        table.string('name', 255).unique().notNullable();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable("tasks");
};
