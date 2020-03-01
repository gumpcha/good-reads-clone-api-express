const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();


// memory db
const users = [];


router.post('/', async function (req, res, next) {
  const user = {
    email: req.body.email,
    password: await bcrypt.hash(req.body.password, 10),
  };
  users.push(user);

  res.send({
    email: user.email,
  });
});


router.post('/session', async function (req, res, next) {
  const user = users.find(user => user.email == req.body.email);

  const match = await bcrypt.compare(req.body.password, user.password);
  if (match) {
    res.send({
      email: user.email,
    });
  } else {
    res.status(401).send({
      code: 401,
      message: 'email/password mismatch',
    });
  }
});


module.exports = router;
