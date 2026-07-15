const express = require('express');
const router = express.Router();

const tripsController = require('../controllers/trips');
const authController = require('../controllers/authentication');
const { authenticateJWT } = require('../middleware/auth');

// Authentication routes
router
    .route('/register')
    .post(authController.register);

router
    .route('/login')
    .post(authController.login);

// Trip routes
router
    .route('/trips')
    .get(tripsController.tripsList)
    .post(authenticateJWT, tripsController.tripsAddTrip);

router
    .route('/trips/:tripCode')
    .get(tripsController.tripsFindByCode)
    .put(authenticateJWT, tripsController.tripsUpdateTrip);

module.exports = router;