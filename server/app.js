const express = require('express');
const app = express();
const indexRouter = require("./routes/index");
const userRouter = require("./routes/user")
const documentRouter = require("./routes/document")
const mongoose = require("mongoose");
const cors = require('cors')
const http = require('http');
const io = require('socket.io')();

require('dotenv').config()

const atlasUrl = process.env.DB_URL;

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

app.use(cors(corsOptions))
app.use('/', indexRouter);
app.use('/api/user', userRouter);
app.use('/api/document', documentRouter);

const server = http.createServer(app)
const socketService = require('./service/socketService')(io)
io.attach(server)

server.listen(8000, function () {
  console.log('App listening on port 8000!')
})
