const express = require('express');
const app = express();
const indexRouter = require("./routes/index");
const userRouter = require("./routes/user")
const documentRouter = require("./routes/document")
const mongoose = require("mongoose");
const cors = require('cors')
const http = require('http');
const jwt = require("jsonwebtoken");
const io = require('socket.io')();
const cookieParser = require('cookie-parser')
require('dotenv').config()

const atlasUrl = process.env.DB_URL;
const publicKey = process.env.PUBLIC_KEY

mongoose.connect(atlasUrl).then(() => console.log("Connected to database."));

let whitelist = ['http://localhost:3000']
let corsOptions = {
  credentials: true,
  origin: function(origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

let tokenVerifier = (req, res, next) => {
  console.log(req.originalUrl)
  if (req.originalUrl.startsWith('/api/document')) {
    const token = req.cookies['token']
    try {
      const decoded = jwt.verify(token, publicKey);
      req.userId = decoded.id
      console.log(req.userId)
    } catch (e) {
      res.send({
        status: 200,
        msg: 'Unauthorized'
      })
      return
    }
  }
  next()
}

app.use(cookieParser())
app.use(cors(corsOptions))
app.use(tokenVerifier)
app.use('/', indexRouter);
app.use('/api/user', userRouter);
app.use('/api/document', documentRouter);


const server = http.createServer(app)
const socketService = require('./service/socketService')(io)
io.attach(server)

server.listen(8000, function () {
  console.log('App listening on port 8000!')
})
