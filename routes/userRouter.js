const router = require("express").Router()
const userController = require("../controllers/userController")
const auth = require("../middleware/auth")

router.post("/register", userController.register)

router.post("/login", userController.login)

router.get("/logout", userController.logout)

router.get("/info", auth, userController.getUser)
// router.get("/info", userController.getUser)

router.get("/refreshToken", userController.refreshToken)

module.exports = router