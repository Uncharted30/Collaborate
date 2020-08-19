const express = require('express');
const router = express.Router();
const userService = require("../service/userService")
const User = require('../model/User')
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json()
const cookieParser = require('cookie-parser')

router.use(jsonParser)
router.use(cookieParser())

router.post('/new', function(req, res) {
  user = new User({
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password: req.body.password
  })
  userService.createUser(user).then((token) => {
    res.cookie('token', token).send({
      status: 200,
      msg: 'success'
    })
  }, (err) => {
    res.send({
      status: 200,
      msg: err.message
    })
  })
});

router.post('/sign_in', function (req, res) {
  user = new User({
    email: req.body.email,
    password: req.body.password
  })

  userService.userSignIn(user).then((token) => {
    res.cookie('token', token).send({
      status: 200,
      msg: "success"
    })
  }).catch((err) => {
    res.send({
      status: 200,
      msg:err.message
    })
  })
});

router.put('/', function (req, res) {
  user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password: req.body.password
  })

  let token = req.cookies['token']
  if (!token) token = req.headers['token']
  userService.updateUser(user, token).then(() => {
    res.status(200).send({
      status: 200,
      msg: 'success'
    })
  }).catch((err) => {
    res.send({
      status: 200,
      msg: err.message
    })
  })
})

router.get('/', (req, res) => {
  let token = req.cookies['token']
  if (!token) token = req.headers['token']
  userService.getUserInfo(token).then(user => {
    res.send({
      status: 200,
      msg: 'success',
      user: user
    })
  }).catch(e => {
    res.send({
      status: 200,
      msg: e.message
    })
  })
})

module.exports = router;
