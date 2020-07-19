const { Model } = require('objection');

const env = process.env.NODE_ENV || 'development';
const connection = require('../knexfile.js')[env];

const knex = require('knex')(connection);
Model.knex(knex);


class User extends Model {
  static get tableName() {
    return 'users';
  }
}

module.exports = User;
