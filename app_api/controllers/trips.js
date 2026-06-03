const mongoose = require('mongoose');
const Trip = require('../models/travlr'); // register model
const Model = mongoose.model('trips');

// Get: /trips - lists all trips
// Regardless of outcome, response must include HTML status code and JSON message to the requesting client
const tripsList = async(req, res) => {
    const q = await Model
        .find({})  // No filter, return all records
        .exec();

        // Uncomment the following line to show results of query on the console
        // console.log(q);

    if(!q)
    { // Database returned no data
        return res
            .status(404)
            .json(err);
    } else {
        return res
            .status(200)
            .json(q);
    }
};

// Get: /trips/:tripCode - find a trip by its code
// Regardless of outcome, response must include HTML status code and JSON message to the requesting client
const tripsFindByCode = async(req, res) => {
    const q = await Model
        .find({'code' : req.params.tripCode })  // Filter by trip code
        .exec();

        // Uncomment the following line to show results of query on the console
        // console.log(q);

    if(!q)
    { // Database returned no data
        return res
            .status(404)
            .json(err);
    } else {
        return res
            .status(200)
            .json(q);
    }
};

module.exports = {
    tripsList,
    tripsFindByCode
};