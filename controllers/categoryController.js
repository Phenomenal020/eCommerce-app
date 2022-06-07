const Category = require("../model/categoryModel")

const categoryController = {
    getCategories: async (req, res) => {
        try {
            const categories = await Category.find()
            res.status(200).json(categories)
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    },
    createCategory: async (req, res) => {
        try {
            const { name } = req.body
            const category = await Category.findOne({ name })
            if (category) return res.status(400).json({ msg: "This category already exists" })
            const newCategory = await Category.create({ name })
            res.status(201).json({ msg: newCategory })
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    },
    deleteCategory: async (req, res) => {
        try {
            const id = req.params.id
            const category = await Category.findByIdAndDelete(id)
            res.json({ msg: "Category deleted" })
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    },
    updateCategory: async (req, res) => {
        try {
            const { name } = req.body
            const updatedCategory = await Category.findByIdAndUpdate({ _id: req.params.id }, { name })
            return res.status(201).json({ msg: "Category updated" })
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    }

}

module.exports = categoryController    