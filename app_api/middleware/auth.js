const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: 'Authorization header is required.'
        });
    }

    const headerParts = authHeader.split(' ');

    if (headerParts.length !== 2 || headerParts[0] !== 'Bearer') {
        return res.status(401).json({
            message: 'Authorization header must use Bearer token format.'
        });
    }

    const token = headerParts[1];

    if (!token) {
        return res.status(401).json({
            message: 'Bearer token is required.'
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, verified) => {
        if (err) {
            return res.status(401).json({
                message: 'Invalid or expired token.'
            });
        }

        req.auth = verified;
        next();
    });
};

module.exports = {
    authenticateJWT
};