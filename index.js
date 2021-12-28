const express = require('express');
var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");
const app = express();
const lyric = require('./api/lyric');

app.use(express.json({extended: false}));
app.use(cors());

app.use('/api/lyric', lyric);

const PORT = process.env.PORT ||  5050;
app.listen(PORT, () => console.log(`Server is running in port ${PORT}`));


