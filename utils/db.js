const { default: mongoose } = require("mongoose");

class ConnectToDB {
    static async connect() {
        try {
            await mongoose.connect(process.env.MONGO_URI, {
                useNewUrlParser: true,
            });
            console.log("connected to db")

        } catch (error) {
            console.log(error);
        }
    }
}
module.exports = ConnectToDB
