const ChatModel = require("../model/ChatModel");

class ChatController {
    async createChat(req, res) {
        try {
            const chat = await ChatModel.create(req.body)
            res.status(200).json({ message: chat, success: true })
        } catch (error) {
            res.status(500).json({ message: error.message, success: false })
        }
    }
    async getChatOfUser(req, res) {
        const { userId } = req.params
        try {
            const chat = await ChatModel.find({
                users: { $in: [userId] }
            }).populate(["users", "latestMessage"])
            res.status(200).json({ message: chat, success: true })
        } catch (error) {
            res.status(500).json({ message: error.message, success: false })
        }
    }
    async getChatById(req, res) {
        const { chatId } = req.params

        try {
            const chat = await ChatModel.findById(chatId).populate(["users", "latestMessage"])
            return res.status(200).json({ message: chat, success: true })
        } catch (error) {
            res.status(500).json({ message: error.message, success: false })
        }
    }
    async getChatByBothUsers(req, res) {
        const { senderId, receiverId } = req.params
        const users = [senderId, receiverId]
        try {
            const chat = await ChatModel.findOne({
                users: { $all: users }
            }).populate(["users", "latestMessage"])
            return res.status(200).json({ message: chat, success: true })
        } catch (error) {
            res.status(500).json({ message: error.message, success: false })
        }
    }
    async createChatForFirstMessage(req, res, next) {
        const { users } = req.body
        try {
            const chat = await ChatModel.create({
                users
            });
            req.body.chatId = chat._doc._id.toString()
            next()

        } catch (error) {
            console.log(error)
        }
    }
    async deleteChat(req, res) {

        try {
            await ChatModel.findByIdAndDelete(req.params.chatId)
            res.status(200).json({ message: "successfully Deleted", success: true })
        } catch (error) {
            console.log(error)
        }
    }

    
}

module.exports = new ChatController()



