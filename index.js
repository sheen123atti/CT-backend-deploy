const express = require('express');
const bodyParser = require('body-parser');
// const cors = require('cors');
// const { User } = require('./db');
// const mongoose = require('mongoose');
const cors = require('cors');

const userRouter = require('./routes/user')

const PORT = 3000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use('/images', express.static('public/images'));
app.use("/user", userRouter)

app.listen(PORT, function(){
    console.log(`Server started at ${PORT}`)
});