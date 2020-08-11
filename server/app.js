const express = require('express');
const app = express();
const indexRouter = require("./routes/index");
const userRouter = require("./routes/users")
const mongoose = require("mongoose");

const atlasUrl = "mongodb+srv://collabs_1:0QiAuXGlkuUPvCNM@collabs.w3ihy.mongodb.net/collaborate?retryWrites=true&w=majority";

mongoose.connect(atlasUrl).then(() => console.log("Connected to database."));

app.use('/', indexRouter);
app.use('/api/user', userRouter);

app.listen(8000, function () {
  console.log('App listening on port 8000!')
})
