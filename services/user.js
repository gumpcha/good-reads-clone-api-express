const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');

const UserModel = require('../models/user');


const jwtSecret = 'FnYqIIHCBMNLemOZ';


class User {
  static async create({ email, password }) {
    const id = uuid.v4();
    const user = {
      id,
      email,
      password: await bcrypt.hash(password, 10),
      access_token: jwt.sign({ id }, jwtSecret),
    };
    return UserModel.query().insertAndFetch(user);
  }

  static async selectOne(where ) {
    return UserModel.query().findOne(where);
  }

  static async update(data) {
    return UserModel.query().findOne(where);
  }

  static async deleteByEmail(email) {
    return UserModel.query().findOne({ email }).delete();
  }
}


module.exports = User;