const { JsonWebTokenError } = require("jsonwebtoken")
const User = require("../model/userModel")
const bcrypt = require("bcrypt")
const { createAccessToken, createRefreshToken } = require("../utils/createToken")

const userController = {
    // register
    register: async (req, res) => {
        try {
            const { name, email, password } = req.body
            const user = await User.findOne({ email })

            if (user) return res.status(400).json({ msg: "Email already exists" })
            if (password.length < 6) return res.status(400).json({ msg: "Password should be at least 6 characters" })

            const newUser = await User.create({ name, email, password })

            // create jwt for authentication
            const accessToken = createAccessToken({ id: newUser._id })
            const refreshToken = createRefreshToken({ id: newUser._id })
            console.log("checking access token", accessToken)
            // console.log("checking refresh token", refreshToken)

            // save the jwt to a cookie
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                path: "/user/refresh_token"
            })

            // res.cookie("accessToken", accessToken, {
            //     httpOnly: true,
            //     path: "/user/refresh_token"
            // })

            res.json({ accessToken, refreshToken })

        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    },
    refreshToken: (req, res) => {
        try {
            const rf_token = req.cookies.refreshToken;
            if (!rf_token) return res.status(400).json({ msg: "Please login or register" })

            jwt.verify(
                rf_token,
                process.env.REFRESH_TOKEN_SECRET,
                (error, user) => {
                    if (error) return res.status(400).json({ msg: "Please login or register" })

                    const accessToken = createAccessToken({ id: user._id })
                    res.json({ user, accessToken })
                })
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body

            const user = await User.findOne({ email })
            if (!user) return res.status(400).json({ msg: "No user doesnot exist" })

            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) return res.status(400).json({ msg: "Incorrect password" })

            // create jwt for authentication if login success
            const accessToken = createAccessToken({ id: user._id })
            const refreshToken = createRefreshToken({ id: user._id })

            // save the jwt to a cookie
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                path: "/user/refresh_token"
            })

            res.json({ accessToken, refreshToken })

        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    },
    logout: async (req, res) => {
        try {
            res.clearCookie("refreshToken", { path: "/user/refresh_token" })
            return res.json({msg: "Logged out"})
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    },
    getUser: async (req, res) => {
        try {
            // req.user populated by auth middleware
            const user = await User.findById(req.user.id).select("-password")
            if(!user) return res.status(400).json({msg: "User doesnot exist"})

            res.json(user)
        } catch(error) {
           return  res.status(500).json({msg: error.message})
        }
    }
}

module.exports = userController