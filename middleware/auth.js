const jwt = require("jsonwebtoken")

// Authenticate user by verifying jwt and if valid, set req.user ===> user
const auth = (req, res, next) => {
    try {
        const token = req.header("Authorization")
        if (!token) return res.status(400).json({ msg: "Invalid Authentication" })

        jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET,
            (error, user) => {
                if (error) return res.status(400).json({ msg: "Invalid Authentication" })
                console.log({ user })
                req.user = user
                next()
            }
        )
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
}

module.exports = auth