const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const cors = require("cors");

const app = express();

const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const users = [
  { name: "Ahmad", status: "offline" },
  { name: "Ali", status: "offline" },
  { name: "Basit", status: "offline" },
  { name: "Bilal", status: "offline" },
  { name: "Kamran", status: "offline" },
  { name: "Walayat", status: "offline" },
];
const msgs = [];
app.use(cors());
app.get("/api/data", (req, res) => {
  res.send({ users, msgs });
});
io.on("connect", (socket) => {
  console.log("Connected");
  socket.on("join", ({ name }, callback) => {
    console.log(name);
    const index = users.findIndex((user) => user.name === name);
    users.splice(index, 1, { name, status: "online" });
    socket.broadcast.emit("response", users);
    // const err = true;
    // if (err) {
    //   callback({ error: "Error" });
    // }
  });
  socket.on("offline", ({ name }) => {
    console.log("Disconnected", name);
    const index = users.findIndex((user) => user.name === name);
    if (name) users.splice(index, 1, { name, status: "offline" });
    socket.broadcast.emit("response", users);
  });
  socket.on("msg", (msg) => {
    console.log("message recievd", msg);
    msgs.push(msg);
    socket.broadcast.emit("sendmsg", msgs);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
