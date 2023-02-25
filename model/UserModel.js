const mongoose = require("mongoose")
const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "username is required"],
    },
    email: {
        type: String,
        required: [true, "email is required"],
    },
    password: {
        type: String,
        required: [true, "password is required"],
    },
    lastLoggedIn: Number,
    profileImg: {
        type: String,
        default: "https://cdn4.vectorstock.com/i/1000x1000/05/73/unknown-person-user-icon-line-vector-35260573.jpg"
    },
    socketId: {
        type: String,
    },
    isOnline: {
        type: Boolean,
    },
    friends: [
        {
            type: mongoose.Types.ObjectId,
            ref: "User"
        }
    ]
}, { timestamps: true })


module.exports = mongoose.model("User", UserSchema)
