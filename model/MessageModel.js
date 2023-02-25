const mongoose = require("mongoose")

const messageSchema = mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "sender Id is required"]
    },
    content: {
        type: String,
        required: [true, "content is required"]
    },
    isImage: {
        type: Boolean,
        default: false,
    },
    images: Array,
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
        required: [true, "chat id is required"]
    }
}, { timestamps: true })


module.exports = mongoose.model("Message", messageSchema)