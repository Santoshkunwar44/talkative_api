const express = require("express")
const morgan = require("morgan")
const cors = require("cors");
const { addOnlineUser, removeOnlineUser, getSocketIdOfAnUser, onlineUsers } = require("./services/socketService/socketService");
require("dotenv").config()
const app = express();
const session = require("express-session")
const MongoStore = require("connect-mongo");
const UserAuthenticator = require("./middlewares/auth");
const path = require("path");
const server = require("http").createServer(app)
const io = require("socket.io")(server, {
    cors: {
        origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
        methods: ['GET', 'POST'],
    }
});
app.use(cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
}))


app.use(express.static(path.join(__dirname, "static")))

app.use(morgan("common"))
app.use(express.json())
require("./utils/db").connect()



// setting up connect-mongodb-session store
const mongoDBstore = MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    ttl: 1000 * 60 * 5,
    collectionName: "vrumies_session",
    autoRemove: 'native',
})

// Express-Session
app.use(
    session({
        name: "chat_app", //name to be put in "key" field in postman etc
        secret: process.env.session_secret,
        resave: true,
        saveUninitialized: false,
        store: mongoDBstore,
        cookie: {
            maxAge: 1000 * 60 * 60 * 1,
            secure: false,
            httpOnly: true,
            SameSite: "None"

        }
    })
);



// routes
app.use("/api/user", require("./Routes/UserRoutes"))
app.use(UserAuthenticator.isAuthorized)
app.use("/api/chat", require("./Routes/ChatRoute"))
app.use("/api/message", require("./Routes/MessageRoute"))




io.on("connection", (socket) => {
    socket.on("join", (userId) => {
        console.log("joining user", userId)
        let user = {
            userId,
            socketId: socket.id
        }
        const onlineUsers = addOnlineUser(user)
        io.emit("get_online_users", onlineUsers)
    });



    // sending message to the specific socket 
    socket.on("start_message", (message) => {
        console.log("oneline users ", onlineUsers)
        console.log("the icoming message", message)
        const { receiver_id } = message;
        const socketId = getSocketIdOfAnUser(receiver_id);
        console.log("the socket id ", socketId)
        if (socketId) {
            io.to(socketId).emit("get_message", message);
        }
    })


    //when disconnect
    socket.on("disconnect", () => {
        const onlineUsers = removeOnlineUser(socket.id)
        console.log(" disconnecting", onlineUsers)
        io.emit("get_online_users", onlineUsers);
    });

});

server.listen(8000, () => console.log("server is started "))
