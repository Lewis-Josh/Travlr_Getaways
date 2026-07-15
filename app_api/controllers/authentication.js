const passport = require('passport');
const User = require('../models/user');

const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            message: 'Name, email, and password are required.'
        });
    }

    try {
        const existingUser = await User.findOne({ email: email }).exec();

        if (existingUser) {
            return res.status(409).json({
                message: 'A user with this email already exists.'
            });
        }

        const user = new User({
            name: name,
            email: email
        });

        user.setPassword(password);

        await user.save();

        const token = user.generateJWT();

        return res.status(201).json({
            token: token
        });
    } catch (err) {
        console.error('Registration error:', err);

        return res.status(500).json({
            message: 'Unable to register user.'
        });
    }
};

const login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: 'Email and password are required.'
        });
    }

    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.error('Login error:', err);

            return res.status(500).json({
                message: 'Unable to process login request.'
            });
        }

        if (!user) {
            return res.status(401).json({
                message: 'Invalid email or password.'
            });
        }

        const token = user.generateJWT();

        return res.status(200).json({
            token: token
        });
    })(req, res);
};

module.exports = {
    register,
    login
};