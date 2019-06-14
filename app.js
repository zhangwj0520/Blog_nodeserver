const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const passport = require('passport');

const user = require('./routes/blog/user');
const authorInfo = require('./routes/blog/authorInfo');
const articles = require('./routes/blog/articles');
const say = require('./routes/blog/say');
const tags = require('./routes/blog/tags');
const types = require('./routes/blog/types');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// CORS
app.use(cors());
//Passport
app.use(passport.initialize());
require('./config/passport')(passport);

//1.博客项目
app.use('/blog/user', user);
app.use('/blog/authorinfo', authorInfo);
app.use('/blog/articles', articles);
app.use('/blog/say', say);
app.use('/blog/tags', tags);
app.use('/blog/types', types);

module.exports = app;
