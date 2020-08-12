const express = require('express');
const app = express();
const indexRouter = require("./routes/index");
const userRouter = require("./routes/users")
const mongoose = require("mongoose");
const cors = require('cors')

require('dotenv').config()

const atlasUrl = process.env.DB_URL;

mongoose.connect(atlasUrl).then(() => console.log("Connected to database."));

app.use(cors())
app.use('/', indexRouter);
app.use('/api/user', userRouter);

app.listen(8000, function () {
  console.log('App listening on port 8000!')
})
