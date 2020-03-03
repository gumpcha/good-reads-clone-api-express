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
    api_key: jwt.sign({ id }, jwtSecret),
  };
  users.push(user);

  res.send({
    email: user.email,
    api_key: user.api_key,
  });
});


router.post('/session', async function (req, res, next) {
  const user = users.find(user => user.email == req.body.email);

  const match = await bcrypt.compare(req.body.password, user.password);
  if (match) {
    res.send({
      email: user.email,
      api_key: user.api_key,
    });
  } else {
    res.status(401).send({
      code: 401,
      message: 'email/password mismatch',
    });
  }
});


module.exports = router;
