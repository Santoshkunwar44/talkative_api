const { createChatForFirstMessage } = require("../controller/ChatController");
const { addMessage, getMessageOfAChat } = require("../controller/MessageController");

const router = require("express").Router()

router.post('/create', addMessage)
router.post('/new_message', createChatForFirstMessage, addMessage)
router.get('/', getMessageOfAChat)

module.exports = router; 