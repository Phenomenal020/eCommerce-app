const categoryController = require("../controllers/categoryController")
const auth = require("../middleware/auth")
const authAdmin = require("../middleware/authAdmin")
const router = require("express").Router()

router.route("/categories")
    .get(categoryController.getCategories)
    .post(auth, authAdmin, categoryController.createCategory)

router.route("/category/:id")
    .delete(auth, authAdmin, categoryController.deleteCategory)
    .put(auth, authAdmin, categoryController.updateCategory)

module.exports = router