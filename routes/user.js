const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const express = require('express');

const router = express.Router();


// memory db
const users = [];

const jwtSecret = 'FnYqIIHCBMNLemOZ';

router.post('/', async function (req, res, next) {
  const id = uuid.v4();
  const user = {
    id,
    email: req.body.email,
    password: await bcrypt.hash(req.body.password, 10),
    access_token: jwt.sign({ id }, jwtSecret),
  };
  users.push(user);

  res.send({
    email: user.email,
    access_token: user.access_token,
  });
});


router.post('/session', async function (req, res, next) {
  const user = users.find(user => user.email == req.body.email);

  const match = await bcrypt.compare(req.body.password, user.password);
  if (match) {
    res.send({
      email: user.email,
      access_token: user.access_token,
    });
  } else {
    res.status(401).send({
      code: 401,
      message: 'email/password mismatch',
    });
  }
});


router.delete('/session', async function (req, res, next) {
  const user = users.find(user => `Bearer ${user.access_token}` == req.headers.authorization);

  if (user) {
    user.access_token = null;

    return res.send({
      code: 200,
      message: 'OK',
    });
  } else {
    return res.status(401).send({
      code: 401,
      message: 'invalid access_token',
    });
  }
});


router.get('/', async function (req, res, next) {
  const user = users.find(user => `Bearer ${user.access_token}` == req.headers.authorization);
  if (!user) {
    return res.status(401).send({
      code: 401,
      message: 'invalid access_token',
    });
  }

  res.send({
    email: user.email,
  });
});


module.exports = router;
