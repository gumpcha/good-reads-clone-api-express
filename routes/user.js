var express = require('express');
var router = express.Router();


router.post('/', function (req, res, next) {
  const user = {
    email: req.body.email,
  };

  res.send(user);
});

module.exports = router;
