const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const express = require('express');

const router = express.Router();

const UserService = require('../services/user');


const jwtSecret = 'FnYqIIHCBMNLemOZ';


async function auth(req, res) {
  const matched = req.headers.authorization.match(/^Bearer (.*)$/);
  const access_token = matched && matched[1];
  const user = await UserService.selectOne({ access_token });
  if (!user) {
    return res.status(401).send({
      code: 401,
      message: 'invalid access_token',
    });
  }

  return user;
}


router.post('/', async function (req, res, next) {
  const exist = await UserService.selectOne({ email: req.body.email });
  if (exist) {
    return res.status(409).send({
      code: 409,
      message: 'already signed_up',
    });
  }

  const user = await UserService.create({
    email: req.body.email,
    password: req.body.password,
  });

  res.send({
    email: user.email,
    access_token: user.access_token,
  });
});


router.delete('/', async function (req, res, next) {
  const user = await auth(req, res);
  await user.$query().delete();

  return res.send({
    code: 200,
    message: 'OK',
  });
});


router.post('/session', async function (req, res, next) {
  const user = await UserService.selectOne({ email: req.body.email });
  if (!user) {
    return res.status(401).send({
      code: 401,
      message: 'email/password mismatch(0)',
    });
  }

  const match = await bcrypt.compare(req.body.password, user.password);
  if (match) {
    user.access_token = jwt.sign({ id: user.id }, jwtSecret),
    await user.$query().updateAndFetch();

    res.send({
      email: user.email,
      access_token: user.access_token,
    });
  } else {
    res.status(401).send({
      code: 401,
      message: 'email/password mismatch(1)',
    });
  }
});


router.delete('/session', async function (req, res, next) {
  const user = await auth(req, res);
  await user.$query().patch({ access_token: null });

  return res.send({
    code: 200,
    message: 'OK',
  });
});


router.get('/', async function (req, res, next) {
  const user = await auth(req, res);

  res.send({
    email: user.email,
  });
});


module.exports = router;
