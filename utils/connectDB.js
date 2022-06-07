const mongoose = require("mongoose")

const MONGO_URI = process.env.MONGODB_URL
// console.log("checking mongo uri", MONGO_URI)

const connectDB = async () => {
    return await mongoose.connect(MONGO_URI, {
        // useCreateIndex: true,
        // useFindAndModify: false,
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, error => {
        if (error) { throw error }
        console.log("Connected to mongodb")
    })
}

module.exports = {
    connectDB
}