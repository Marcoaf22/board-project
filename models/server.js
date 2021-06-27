const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const { dbConnection } = require("../database/config");
const socketController = require("../sockets/controller");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.serverIO = require("http").createServer(this.app);
    this.io = require("socket.io")(this.serverIO);

    // Establecer motor de plantilla
    console.log(__dirname);
    this.app.set("view engine", "hbs");

    //Rutas
    this.paths = {
      // chat: "/chat",
      auth: "/api/auth",
      // buscar: "/api/buscar",
      // categorias: "/api/categorias",
      // productos: "/api/productos",
      // usuarios: "/api/usuarios",
      // uploads: "/api/uploads",
      sessions: "/session",
      users: "/",
      home: "/home",
    };

    // Conectar a base de datos
    this.conectarDB();

    // Middlewares
    this.middlewares();

    // Rutas de mi aplicación
    this.routes();

    // Configuracion Websockets
    this.socket();
  }

  async conectarDB() {
    await dbConnection();
  }

  middlewares() {
    // CORS
    this.app.use(cors());

    // Lectura y parseo del body
    this.app.use(express.json());

    //Aceptar form
    this.app.use(express.urlencoded({ extended: true }));

    //Sessions
    //Almacenar sessiones
    const store = new MongoDBStore({
      uri: process.env.MONGODB_CNN,
      collection: "mySessions",
      databaseName: "board",
    });

    // Catch errors
    store.on("error", function (error) {
      console.log(error);
    });

    this.app.use(
      session({
        secret: "MySecretKey-Board",
        cookie: {
          maxAge: 1000 * 60 * 60 * 24 * 7,
        },
        store: store,
        resave: false,
        saveUninitialized: true,
      })
    );

    // Directorio Público
    this.app.use(express.static("public"));

    // Fileupload - Carga de archivos
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
        createParentPath: true,
      })
    );
  }

  routes() {
    this.app.use(this.paths.auth, require("../routes/auth"));
    // this.app.use(this.paths.buscar, require("../routes/buscar"));
    // this.app.use(this.paths.categorias, require("../routes/categorias"));
    // this.app.use(this.paths.productos, require("../routes/productos"));
    // this.app.use(this.paths.usuarios, require("../routes/usuarios"));
    // this.app.use(this.paths.uploads, require("../routes/uploads"));
    // this.app.use(this.paths.chat, require("../routes/chat"));
    this.app.use(this.paths.sessions, require("../routes/sessions"));
    this.app.use(this.paths.users, require("../routes/login"));
    this.app.use(this.paths.home, require("../routes/home"));

    this.app.use("*", (req, res) => {
      console.log("ENDPOINT");
      res.render("404");
    });
  }

  listen() {
    this.serverIO.listen(this.port, () => {
      console.log("Test heroku");
      console.log("Servidor corriendo en puerto", this.port);
    });
  }

  socket() {
    socketController(this.io);
    // this.io.on("connection", socketController);
  }
}

module.exports = Server;
