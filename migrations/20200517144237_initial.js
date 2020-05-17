const table = 'users';


exports.up = function (knex, Promise) {
  return knex.schema.createTable(table, function (table) {
    table.string('id').notNullable();
    table.string('email').notNullable();
    table.string('password').notNullable();
    table.string('access_token').notNullable();
    table.datetime('created_at', { precision: 3 }).defaultTo(knex.fn.now());
    table.datetime('updated_at', { precision: 3 }).defaultTo(knex.fn.now());
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable(table);
};