const User = require("../model/userModel")

const authAdmin = async (req, res, next) => {
    try {
        const id = req.user.id
        const user = await User.findOne({
            _id: id
        })
        if (user.role === 0) {
            return res.status(400).json({ msg: "Admin resources; access denied" })
        } else if (user.role === 1) {
            // Admin.... pass
            next()
        } else return res.status(400).json({ msg: "Who the fuck are you" })
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
}

module.exports = authAdmin