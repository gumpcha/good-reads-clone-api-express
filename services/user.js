const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');

const ApiError = require('../libs/error');
const UserModel = require('../models/user');


const jwtSecret = process.env.ACCESS_TOKEN_SECRET;


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

  static async login({ email, password }) {
    const user = await User.selectOne({ email });
    if (!user) throw ApiError.UnauthorizedError('email/password mismatch(0)');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw ApiError.UnauthorizedError('email/password mismatch(1)');

    user.access_token = jwt.sign({ id: user.id }, jwtSecret),
    await user.$query().updateAndFetch();

    return user;
  }

  static async selectOne(where ) {
    return UserModel.query().findOne(where);
  }

  static async deleteByEmail(email) {
    return UserModel.query().findOne({ email }).delete();
  }
}


module.exports = User;