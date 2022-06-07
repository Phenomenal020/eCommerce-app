const Products = require("../model/productModel")

class APIFeatures {
    constructor(query, queryString) {
        this.query = query  // from Products.find()
        this.queryString = queryString  // from req.query
    }

    // Filter the query
    filtering() {
        // Extract the query object from req.query
        const queryObj = { ...this.queryString }  // this.queryString --> req.query
        // screen queryObj to remove excluded fields
        const excludedFields = ["page", "sort", "limit"]
        excludedFields.forEach(elem => {
            delete (queryObj[elem])   // remove query === page, sort or limit
        })
        // convert it to a string
        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, match => "$" + match)
        this.query.find(JSON.parse(queryStr))
        return this
    }
    sorting() {
        console.log({ checking: this.queryString })
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(",").join(" ")
            this.query = this.query.sort(sortBy)
        } else {
            this.query = this.query.sort("-createdAt")
        }
        return this
    }
    paginating() {
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 3
        const skip = (page - 1) * limit
        this.query = this.query.skip(skip).limit(limit)
        return this
    }
}

const ProductController = {
    getProducts: async (req, res) => {
        try {
            console.log({ "REQ QUERY": req.query })
            const queryProds = await Products.find()
            const features = new APIFeatures(queryProds, req.query).filtering().sorting().paginating()
            const products = features.query
            return res.json(products)
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    },
    createProduct: async (req, res) => {
        try {
            const { product_id, title, price, description, content, images, category } = req.body

            if (!images) { return res.status(400).json({ msg: "No image upload" }) }

            const product = await Products.findOne({ product_id })
            if (product) { return res.status(400).json({ msg: "This product already exists" }) }

            const newProduct = new Products({
                product_id, title: title.toLowerCase(), price, description, content, images, category
            })
            await newProduct.save()
            return res.status(201).json({ newProduct })

        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    },
    deleteProduct: async (req, res) => {
        try {
            await Products.findByIdAndDelete(req.params.id)
            return res.status(200).json({ msg: "Product deleted successfully" })
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    },
    updateProduct: async (req, res) => {
        try {
            // const oldProduct = await Products.findById(req.params.id)
            const { product_id, title, price, description, content, images, category } = req.body

            if (!images) { return res.status(400).json({ msg: "No image upload" }) }

            await Products.findOneAndUpdate({ _id: req.params.id }, { product_id, title, price, description, content, images, category })

            return res.status(200).json({ msg: "Product updated successfully" })
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    }
}

module.exports = ProductController