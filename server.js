// Necessary imports
require("dotenv").config()
const express = require("express")
const cors = require("cors")
const fileupload = require('express-fileupload');
const cookieParser = require("cookie-parser")

const { connectDB } = require("./utils/connectDB")

const app = express()

// middlewares
app.use(express.json())
// for req.body
app.use(cookieParser())
app.use(cors())
app.use(fileupload({ useTempFiles: true }))

// localhost:PORT/user/register
app.use("/user", require("./routes/userRouter"))
// localhost:PORT/api/category
app.use("/api", require("./routes/categoryRouter"))
// localhost:PORT/api/upload
app.use("/api", require("./routes/upload"))
app.use("/api", require("./routes/productRouter"))

// database connection
try {
    const result = connectDB()
    if (result) {
        const PORT = process.env.PORT || 5000
        app.listen(PORT, () => {
            console.log("server is running on port ", PORT)
        })
    }
} catch (error) {
    console.log("Mongodb connection error", error)
}