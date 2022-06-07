const router = require("express").Router()
const ProductController = require("../controllers/productController")

router.route("/products")
    .get(ProductController.getProducts)
    .post(ProductController.createProduct)

router.route("/products/:id")
    .delete(ProductController.deleteProduct)
    .put(ProductController.updateProduct)

module.exports = router