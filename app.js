const express = require('express');
const userRoute = require('./Routers/userRouter');

const app = express();

app.use(express.json());

app.use('/api/user', userRoute);

module.exports = app 

