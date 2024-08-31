const express = require('express')

const router = express.Router();

const userRoutes = require('./user')
const authRoutes = require('./auth')

userRoutes(router);
authRoutes(router);

module.exports = router