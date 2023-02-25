const mongoose = require("mongoose")

const chatSchema = mongoose.Schema({
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "users id is required"]
    }],
    chatName: {
        type: String,
    },
    isGroupChat: {
        type: Boolean,
        default: false
    },
    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
    }
}, { timestamps: true })


module.exports = mongoose.model("Chat", chatSchema)
