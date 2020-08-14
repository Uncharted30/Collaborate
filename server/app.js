const express = require('express');
const app = express();
const indexRouter = require("./routes/index");
const userRouter = require("./routes/user")
const documentRouter = require("./routes/document")
const mongoose = require("mongoose");
const cors = require('cors')

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

app.listen(8000, function () {
  console.log('App listening on port 8000!')
})
