const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const express = require('express');


const router = express.Router();

const UserService = require('../services/user');
const ApiError = require('../libs/error');



const wrapAsync = fn => (req, res, next) => fn(req, res, next).catch(next);


async function auth(req, res, next) {
  const matched = req.headers.authorization.match(/^Bearer (.*)$/);
  const access_token = matched && matched[1];
  const user = await UserService.selectOne({ access_token });
  if (!user) throw ApiError.UnauthorizedError('invalid access_token');

  req.$user = user;

  return next();
}


router.post  ('/', wrapAsync(createUser));
router.get   ('/', wrapAsync(auth), wrapAsync(selectUser));
router.delete('/', wrapAsync(auth), wrapAsync(deleteUser));
router.post  ('/session', wrapAsync(loginUser));
router.delete('/session', wrapAsync(auth), wrapAsync(logoutUser));


async function selectUser(req, res, next) {
  const $user = req.$user;

  res.send({
    email: $user.email,
  });
}


async function createUser(req, res, next) {
  const exist = await UserService.selectOne({ email: req.body.email });
  if (exist) throw ApiError.ConflictError('already signed_up');

  const user = await UserService.create({
    email: req.body.email,
    password: req.body.password,
  });

  res.send({
    email: user.email,
    access_token: user.access_token,
  });
}


async function deleteUser(req, res, next) {
  const $user = req.$user;

  await $user.$query().delete();

  return res.send({
    code: 200,
    message: 'OK',
  });
}


async function loginUser(req, res, next) {
  const user = await UserService.login({ email: req.body.email, password: req.body.password });

  res.send({
    email: user.email,
    access_token: user.access_token,
  });
}


async function logoutUser(req, res, next) {
  const $user = req.$user;

  await $user.$query().patch({ access_token: null });

  return res.send({
    code: 200,
    message: 'OK',
  });
}



module.exports = router;
