const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
//store the usernames
const users = {};
let name;

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/chat", (req, res) => {
  //console.log(req.query.userName);
  name = req.query.userName;
  if (name) {
    console.log(req.query.userName);
    res.sendFile(__dirname + "/home.html");
  }
});
io.on("connection", (socket) => {
  //console.log("a user connected");
  users[socket.id] = name;
  socket.broadcast.emit("user-connected", name);
  socket.on("chat message", (msg) => {
    socket.broadcast.emit("chat message", {
      msg: msg,
      name: users[socket.id],
    });
  });
});

http.listen(3000, () => {
  console.log("listening on *:3000");
});
