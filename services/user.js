const CryptoJS = require('crypto-js');
const User = require('../models/User');

const patchUser = async (payload) => {
    const { password, username, id } = payload;

    try {
        const encryptedPassword = CryptoJS.AES.encrypt(password, process.env.PASS_SEC).toString();

        const updatedUser = await User.findByIdAndUpdate(id, {
            username,
            password: encryptedPassword
        }, { new: true });

        return { doc: updatedUser };
    } catch (error) {
        throw new Error('Transaction failed: unable to update user.');
    }
};

const deleteUser = async (payload) => {
    const { id } = payload;

    try {
        await User.findByIdAndDelete(id);

        return { doc: 'User has been successfully deleted.' };
    } catch (error) {
        throw new Error('Transaction failed: unable to delete user.');
    }
};

const getUserById = async (payload) => {
    const { id } = payload;

    try {
        const user = await User.findById(id);

        if (!user) {
            throw new Error('User not found.');
        }

        const { password, ...doc } = user._doc;

        return { doc };
    } catch (error) {
        throw new Error('Transaction failed: unable to fetch user.');
    }
};

const getUsers = async (payload) => {
    try {
        const { limit = 10, offset = 0 } = payload;

        const users = await User.find().skip(offset).limit(limit);

        const doc = users.map((user) => {
            const { password, ...result } = user._doc;
            return { ...result };
        });

        return { doc };
    } catch (error) {
        throw new Error('Transaction failed: unable to fetch users.');
    }
};


module.exports = {
    patchUser,
    deleteUser,
    getUserById,
    getUsers,
};
