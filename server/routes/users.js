const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
const userService = require("../service/userService")
const User = require('../model/User')


router.post('/', function(req, res) {
  user = new User({
    email: req.email,
    firstName: req.firstName,
    lastName: req.lastName,
    password: req.password
  })
  userService.createUser(user).then((user) => {
    res.json(user)
  }, (err) => {
    res.error(400).send(err)
  })
});

module.exports = router;
