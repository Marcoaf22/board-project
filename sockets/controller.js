const {
  getUser,
  getSession,
  saveDiagram,
  getDiagrams,
} = require("../helpers/generar-jwt");

const socketController = (io) => {
  var diagram;
  let numUser = 0;
  io.on("connection", async (socket) => {
    let uid = socket.handshake.auth.uid;
    let room = socket.handshake.auth.room;
    const { name, _id, email } = await getUser(uid);
    const session = await getSession(room);
    let anfitrion = uid == session.user_id;
    console.log("Cliente " + name + " conectado, Anfitrion: ", anfitrion);

    socket.join(room);

    //A LOS USUARIOS SE LE ENVIA EL DIAGRAMA
    if (!anfitrion) {
      console.log("ENVIANDO DIAGRAMA");
      socket.on("cargar_diagrama", (callback) => {
        console.log("ESCUCHANDO DESDE LE SERVIDOR CARGAR DIAGRAMA");
        callback(io.diagrama);
      });
      // io.to('room')("cargar_diagrama", (callback) => {
      //   callback(io.diagrama);
      // });
    }

    socket.on("select diagrama", (data) => {
      if (anfitrion) {
        console.log("DESDE SELECT DIAGRAM");
        s;
        io.diagrama = data;
        socket.to(room).emit("nuevo diagrama", io.diagrama);
      }
    });

    socket.on("diagrama", (lastChanged, complet) => {
      console.log("ESCUCHANDO DIAGRAMA");
      io.diagrama = complet;
      socket.to(room).emit("diagrama", lastChanged);
    });

    socket.to(room).emit("login", { user: name, uid });

    socket.on("guardar diagrama", (name, diagram_id) => {
      console.log("GUARDANDO DIAGRAMA");
      let data = {
        user_id: uid,
        data: io.diagrama,
        name,
      };
      saveDiagram(data, diagram_id);
    });

    socket.on("cargar diagramas", (callback) => {
      getDiagrams(uid).then((diagramas) => {
        callback(diagramas);
      });
    });

    socket.to(room).emit("addUser", { name, numUser });

    socket.on("disconnect", () => {
      socket.to(room).emit("logout", { username: name, uid: uid });

      console.log("Cliente desconectado");
    });
  });
};

module.exports = socketController;
