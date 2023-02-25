
module.exports = function (server) {
    const io = require("socket.io")(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ['GET', 'POST']
        }
    });



    io.on("connection", (socket) => {


    });

}
