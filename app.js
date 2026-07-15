require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const hbs = require('hbs');
const passport = require('passport');

// Database and authentication configuration
require('./app_api/models/db');
require('./app_api/config/passport');

// Route imports
const indexRouter = require('./app_server/routes/index');
const usersRouter = require('./app_server/routes/users');
const travelRouter = require('./app_server/routes/travel');
const apiRouter = require('./app_api/routes/index');

const app = express();

// View engine setup
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'hbs');

// Register Handlebars partials
hbs.registerPartials(path.join(__dirname, 'app_server', 'views/partials'));

// Standard middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Serve static assets
app.use(express.static(path.join(__dirname, 'public')));

// Initialize Passport
app.use(passport.initialize());

// API CORS headers
app.use('/api', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.header(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, OPTIONS'
    );

    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }

    next();
});

// Application routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/travel', travelRouter);
app.use('/api', apiRouter);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
    const isDevelopment = req.app.get('env') === 'development';

    res.locals.message = err.message;
    res.locals.error = isDevelopment ? err : {};

    res.status(err.status || 500);

    if (req.originalUrl.startsWith('/api')) {
        return res.json({
            message: err.status === 404
                ? 'API endpoint not found.'
                : 'An unexpected server error occurred.'
        });
    }

    res.render('error');
});

module.exports = app;