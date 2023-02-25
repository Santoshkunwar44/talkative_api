const { registerUser, searchUser, loginUser, updateUser, getLoggedInUser, UserLogout } = require("../controller/Usercontroller")
const UserAuthenticator = require("../middlewares/auth")

const router = require("express").Router()

router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/loggedInUser", getLoggedInUser)
router.get("/logout", UserLogout)
router.put("/:userId", updateUser)
router.get("/search", searchUser)

module.exports = router