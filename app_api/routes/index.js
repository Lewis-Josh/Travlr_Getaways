const express = require("express");
const router = express.Router();

// Bring in the controller
const tripsController = require("../controllers/trips");

// define route for our trips endpoint
router
    .route("/trips")
    .get(tripsController.tripsList) // GET method routes triplist
    .post(tripsController.tripsAddTrip); // POST method adds a trip


// GET Method routes tripsFindByCode - requires parameter
router.route("/trips/:tripCode")
    .get(tripsController.tripsFindByCode)
    .put(tripsController.tripsUpdateTrip);

module.exports = router;