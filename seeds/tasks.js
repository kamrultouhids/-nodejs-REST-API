exports.seed = function (knex, Promise) {
    return knex('tasks').truncate().then(function () {
        return knex('tasks').insert([
            { name: 'A' },
            { name: 'B' },
            { name: 'C' },
            { name: 'D' },
            { name: 'E' }
        ]);
    });
};
