const jwt = require("jsonwebtoken")

const createAccessToken = (userId) => {
    return jwt.sign(userId, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "1d"})
}

const createRefreshToken = (userId) => {
    return jwt.sign(userId, process.env.REFRESH_TOKEN_SECRET, {expiresIn: "3d"})
}

module.exports = {createAccessToken, createRefreshToken}