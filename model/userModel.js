const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        default: 0
    },
    cart: {
        type: Array,
        default: []
    }
}, { timestamps: true })

// MONGOOSE HOOKS ------------
// Fire a function before doc is saved to the database
userSchema.pre("save", async function (next) {
    // hash the password before saving to database
    const salt = await bcrypt.genSalt()
    if (this.password) {
        this.password = await bcrypt.hash(this.password, salt)
        // this ==> Instance of new User()
    }
    next()
})

userSchema.post("save", async function (doc, next) {
   console.log(`${this} successfully saved to the database`)
    next()
})


module.exports = mongoose.model("MERNUsers", userSchema)