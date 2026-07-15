const Trip = require('../models/travlr');

const requiredTripFields = [
    'code',
    'name',
    'length',
    'start',
    'resort',
    'perPerson',
    'image',
    'description'
];

const validateTripPayload = (body) => {
    const missingFields = requiredTripFields.filter((field) => {
        return !body[field];
    });

    return missingFields;
};

const tripsList = async (req, res) => {
    try {
        const trips = await Trip.find({}).exec();

        return res.status(200).json(trips);
    } catch (err) {
        console.error('Error retrieving trips:', err);

        return res.status(500).json({
            message: 'Unable to retrieve trips.'
        });
    }
};

const tripsFindByCode = async (req, res) => {
    const tripCode = req.params.tripCode;

    if (!tripCode) {
        return res.status(400).json({
            message: 'Trip code is required.'
        });
    }

    try {
        const trip = await Trip.find({ code: tripCode }).exec();

        if (!trip || trip.length === 0) {
            return res.status(404).json({
                message: 'Trip not found.'
            });
        }

        return res.status(200).json(trip);
    } catch (err) {
        console.error('Error retrieving trip:', err);

        return res.status(500).json({
            message: 'Unable to retrieve trip.'
        });
    }
};

const tripsAddTrip = async (req, res) => {
    const missingFields = validateTripPayload(req.body);

    if (missingFields.length > 0) {
        return res.status(400).json({
            message: 'Missing required trip fields.',
            missingFields: missingFields
        });
    }

    try {
        const newTrip = await Trip.create({
            code: req.body.code,
            name: req.body.name,
            length: req.body.length,
            start: req.body.start,
            resort: req.body.resort,
            perPerson: req.body.perPerson,
            image: req.body.image,
            description: req.body.description
        });

        return res.status(201).json(newTrip);
    } catch (err) {
        console.error('Error adding trip:', err);

        return res.status(500).json({
            message: 'Unable to add trip.'
        });
    }
};

const tripsUpdateTrip = async (req, res) => {
    const tripCode = req.params.tripCode;

    if (!tripCode) {
        return res.status(400).json({
            message: 'Trip code is required.'
        });
    }

    const missingFields = validateTripPayload(req.body);

    if (missingFields.length > 0) {
        return res.status(400).json({
            message: 'Missing required trip fields.',
            missingFields: missingFields
        });
    }

    try {
        const updatedTrip = await Trip.findOneAndUpdate(
            { code: tripCode },
            {
                code: req.body.code,
                name: req.body.name,
                length: req.body.length,
                start: req.body.start,
                resort: req.body.resort,
                perPerson: req.body.perPerson,
                image: req.body.image,
                description: req.body.description
            },
            {
                new: true,
                runValidators: true
            }
        ).exec();

        if (!updatedTrip) {
            return res.status(404).json({
                message: 'Trip not found.'
            });
        }

        return res.status(200).json(updatedTrip);
    } catch (err) {
        console.error('Error updating trip:', err);

        return res.status(500).json({
            message: 'Unable to update trip.'
        });
    }
};

module.exports = {
    tripsList,
    tripsFindByCode,
    tripsAddTrip,
    tripsUpdateTrip
};