const bcrypt = require("bcryptjs")
const UserModel = require("../../model/UserModel")

class AuthService {
    async hashPassword(password) {
        try {
            const salt = await bcrypt.genSalt(10)
            const hash = await bcrypt.hash(password, salt)
            return hash

        } catch (error) {
            // error handler
            console.log(error.message)
        }
    }
    async comparePassword(password, hash_password) {
        try {
            const isValid = await bcrypt.compare(password, hash_password)
            console.log(isValid)
            return isValid

        } catch (error) {
            // error handler
            console.log(error.message)
        }
    }

    async isUserUpdated(prevUser) {
        try {
            const user = await UserModel.findById(prevUser._id)
            const { updatedAt: newUserUpdatedTime } = user._doc;
            const { updatedAt: prevUserUpdatedTime } = prevUser
            let newUpdatedTimeInMS = new Date(newUserUpdatedTime).getTime()
            let prevUpdatedTimeInMS = new Date(prevUserUpdatedTime).getTime()
            if (newUpdatedTimeInMS > prevUpdatedTimeInMS) {
                const { password, ...others } = user._doc
                return others
            } else {
                return prevUser;
            }
        } catch (error) {
            console.log(error);
            return error;
        }
    }
}

module.exports = new AuthService()
