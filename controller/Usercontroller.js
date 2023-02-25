const UserModal = require("../model/UserModel")
const { hashPassword, comparePassword, isUserUpdated } = require("../services/AuthService/Authservice")

class UserController {


    async registerUser(req, res) {
        const { password: inputPassword } = req.body
        try {
            const hashed_password = await hashPassword(inputPassword)
            req.body.password = hashed_password
            req.body.lastLoggedIn = Date.now()
            const savedUser = await UserModal.create(req.body);
            const { password, ...others } = savedUser._doc;
            let userData = {
                ...others,
            }
            req.session.user = userData; // Auto saves session data in mongo store
            return res.status(200).json({ message: userData, success: true })
        } catch (error) {
            console.log(error)
            res.status(500).send({ message: error.message, success: false })
        }
    }
    async loginUser(req, res) {
        const { password: user_password, email } = req.body
        try {
            const user = await UserModal.findOne({ email })
            if (!user) return res.status(402).json({ message: "User not found", success: false })
            const { password, ...others } = user._doc;
            const isValid = await comparePassword(user_password, password)
            if (!isValid) return res.status(403).json({ message: "Invalid credentails", success: false })
            await UserModal.findByIdAndUpdate(others._id, {
                lastLoggedIn: Date.now()
            })
            let userData = {
                ...others,
                lastLoggedIn: Date.now()
            }
            req.session.user = userData; // Auto saves session data in mongo store
            return res.status(200).json({ message: userData, success: true }) // sends cookie with sessionID automatically in response
        } catch (error) {
            console.log(error)
            res.status(500).send({ message: error.message, success: false })
        }
    }
    async getLoggedInUser(req, res) {

        const sessionUser = req.session?.user;
        console.log(req.session)
        if (sessionUser) {

            let updatedUser = await isUserUpdated(sessionUser)
            return res.status(200).json({ message: updatedUser, success: true })
        } else {
            res.status(403).json({ message: "You are not logged ", success: false });
        }

    }
    async searchUser(req, res) {
        const { userId } = req.query
        let keyword = {}
        try {
            if (!userId) {

                keyword = req.query.search_query ? {
                    $or: [
                        { username: { $regex: req.query.search_query, $options: "i" } },
                        { email: { $regex: req.query.search_query, $options: "i" } },
                    ]
                } : {}

            } else {
                keyword = { _id: userId }
            }
            const fetchedUser = await UserModal.find(keyword)
            res.status(200).json({ message: fetchedUser, success: true })
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: error, success: false })
        }
    }
    async updateUser(req, res) {

        const { userId } = req.params;
        if (!userId) {
            throw new Error("userId is required")
        }
        try {
            const user = await UserModal.findById(userId)
            if (!user) return res.status(404).send({ message: "Invalid email address", success: false });
            if (req.body.password) {
                const hashed_password = await hashPassword(req.body.password)
                req.body.password = hashed_password
            }
            const updated = await UserModal.findByIdAndUpdate(userId, {
                $set: req.body
            }, {
                new: true
            })
            res.status(200).json({ message: updated, success: true })
        } catch (error) {
            res.status(500).json({ message: error.message, success: false })
        }
    }

    async UserLogout(req, res) {
        try {
            req.session.destroy((err) => {
                //delete session data from store, using sessionID in cookie
                if (err) throw err;
                res.clearCookie("chat_app"); // clears cookie containing expired sessionID
                res.status(200).json({
                    message: "Logged out successfully", success: true
                });
            });
        } catch (error) {
            res.status(500).json({ message: error, success: false })
        }
    }
}
module.exports = new UserController()

