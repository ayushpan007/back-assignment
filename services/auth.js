const CryptoJs = require('crypto-js')
const User = require('../models/User')
const jwt = require('jsonwebtoken')

const register = async (payload) => {
    const { username, email, password, isAdmin } = payload;

    try {
        const encryptedPassword = CryptoJs.AES.encrypt(password, process.env.PASS_SEC).toString();
        const newUser = new User({
            username,
            email,
            password: encryptedPassword,
            isAdmin: isAdmin || false,
        });
        await newUser.save();
        return { message: 'User successfully registered' };
    } catch (err) {
        throw new Error(`User registration failed: ${err.message}`);
    }
}

const login = async (payload) => {
    const { username, password } = payload;
    try {
        const user = await User.findOne({ username });

        if (!user) {
            return { errors: [{ name: 'user', message: 'No user found with this username' }] };
        }
        const decryptedPassword = CryptoJs.AES.decrypt(user.password, process.env.PASS_SEC).toString(CryptoJs.enc.Utf8);
        if (password !== decryptedPassword) {
            return { errors: [{ name: 'password', message: 'Wrong password' }] };
        }
        const access_token = jwt.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin,
            },
            process.env.JWT_SEC,
            { expiresIn: '1d' }
        );
        return { doc: { access_token } };
    } catch (err) {
        throw new Error(`Login failed: ${err.message}`);
    }
};

module.exports = {
    register,
    login
}