const ChatModel = require("../model/ChatModel");
const MessageModel = require("../model/MessageModel");

class MessageController {
    async addMessage(req, res) {
        try {
            let message = await MessageModel.create(req.body)
            message = await message.populate(["senderId", "chatId"])

            // add latest message to the chat

            await ChatModel.findByIdAndUpdate(req.body.chatId, {
                latestMessage: message._doc._id
            })

            res.status(200).json({ message: message, success: true })
        } catch (error) {
            res.status(500).json({ message: error.message, success: false })
        }
    }
    // fetch message of specific chat Id 

    async getMessageOfAChat(req, res) {
        const { chatId } = req.query;


        if (!chatId) {
            return res.status(500).json({ message: "Invalid", success: false })
        }
        try {
            const messages = await MessageModel.find({ chatId }).populate(["senderId", "chatId"])
            res.status(200).json({ message: messages, success: true })
        } catch (error) {
            res.status(500).json({ message: error.message, success: false })
        }
    }

    async addMessageForNewChat(req, res) {
        console.log(req.body)
        res.status(200).json({ message: "hello", success: true })
    }




}

module.exports = new MessageController()