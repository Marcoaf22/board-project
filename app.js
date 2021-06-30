require("dotenv").config();

const path = require("path");
const Server = require("./models/server");

const server = new Server();
server.app.set("views", path.join(__dirname, "resources/views"));

server.listen();
