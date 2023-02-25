class UserAuthenticator {
    static isAuthorized(req, res, next) {

        try {
            const sessionUser = req.session?.user
            if (sessionUser) {
                next()
            } else {
                throw new Error("not authorized")
            }
        } catch (error) {
            res.status(403).json({ message: error.message, success: false })
        }

    }
}
module.exports = UserAuthenticator