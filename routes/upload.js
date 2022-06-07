const router = require("express").Router()
const cloudinary = require("cloudinary")
const auth = require("../middleware/auth")
const authAdmin = require("../middleware/authAdmin")
const fs = require("fs")

// Upload image to cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

// upload image - admin only
// router.post("/upload", auth, authAdmin, (req, res) => {
router.post("/upload", (req, res) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ msg: "no files were uploaded" })
        }

        const file = req.files.file

        if (file.size > 1024 * 1024) {   // filesize <1mb
            removeTmp(file.tempFilePath)
            return res.status(400).json({ msg: "File size too large" })
        }

        if (!(file.mimetype === "image/jpeg" || file.mimetype === "image/png")) {
            removeTmp(file.tempFilePath)
            return res.status(400).json({ msg: "Incorrect file format" })
        }

        cloudinary.v2.uploader.upload(file.tempFilePath, { folder: "test" }, async (error, result) => {
            try {
                if (error) throw error
                removeTmp(file.tempFilePath)
                res.json({ public_id: result.public_id, url: result.secure_url })
                // result ===> result.public_id, result.secure_url
            }
            catch (error) { console.log(error.message) }
        })

        console.log({ file })

    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
})

// delete uploaded image - admin only
router.post("/destroy", auth, authAdmin, (req, res) => {
    const { public_id } = req.body
    if (!public_id) {
        return res.status(400).json({ msg: "No image selected" })
    }
    cloudinary.v2.uploader.destroy(public_id, async (error, result) => {
        try {
            if (error) { throw error }
            return res.status(200).json({ msg: "Image deleted" })
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    })
})

const removeTmp = (path) => {
    fs.unlink(path, error => {
        if (error) return res.status(400).json({ error: error.message })
    })
}

module.exports = router