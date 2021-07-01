const {
  getUser,
  getSession,
  saveDiagram,
  getDiagrams,
  sessionFinish,
} = require("../helpers/generar-jwt");

const socketController = (io) => {
  io.diagrama = {
    class: "GraphLinksModel",
    linkKeyProperty: "idForIncrement",
    nodeDataArray: [],
    linkDataArray: [],
  };
  var diagrama = {
    class: "GraphLinksModel",
    linkKeyProperty: "idForIncrement",
    nodeDataArray: [],
    linkDataArray: [],
  };
  io.on("connection", async (socket) => {
    let uid = socket.handshake.auth.uid;
    let room = socket.handshake.auth.room;
    const { name, img } = await getUser(uid);
    const session = await getSession(room);
    // let isAnfitrion = uid == session.user_id;
    socket.isAnfitrion = uid == session.user_id;
    socket.name = name;
    console.log(
      "Cliente " + name + " conectado, Anfitrion: ",
      socket.isAnfitrion
    );

    // io.on("testo", (hola) => {
    //   console.log("ESCUCHANDO EVENTO: ISANFITRION - ", socket.name);
    //   console.log(hola);
    // });

    socket.join(room);

    //A LOS USUARIOS SE LE ENVIA EL DIAGRAMA
    if (!socket.isAnfitrion) {
      socket.on("cargar_diagrama", (callback) => {
        console.log("EVENTO: CARGAR_DIAGRAMA - ", socket.name);
        console.log("ID");
        console.log(io.diagrama);
        console.log("VAR");
        console.log(diagrama);
        // console.log("ESCUCHANDO DESDE LE SERVIDOR CARGAR DIAGRAMA");
        callback(diagrama);
        console.log("EVENTO FINISH: CARGAR_DIAGRAMA - ", socket.name);
      });

      // io.to('room')("cargar_diagrama", (callback) => {
      //   callback(io.diagrama);
      // });
    }

    socket.emit("isAnfitrion", { data: socket.isAnfitrion });

    // console.log("DEFINIENDO EL EVENTO TESTO");
    socket.on("testo", async (data) => {
      console.log("escuchando testo");
      console.log(data);
    });

    socket.on("select diagrama", (data) => {
      if (socket.isAnfitrion) {
        console.log("EVENTO: SELECT DIAGRAM");
        io.diagrama = data;
        diagrama = data;
        socket.to(room).emit("nuevo diagrama", io.diagrama);
      }
    });

    socket.on("diagrama", (lastChanged, complet) => {
      console.log("EVENTO: DIAGRAMA - ", socket.name);
      io.diagrama = complet;
      console.log("ID");
      console.log(io.diagrama);
      diagrama = complet;
      console.log("VAR");
      console.log(diagrama);
      socket.to(room).emit("diagrama", lastChanged);
      console.log("EVENTO FINISH: DIAGRAMA - ", socket.name);
    });

    socket.to(room).emit("login", { user: name, uid, img });

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

    // console.log(socket);

    socket.to(room).emit("addUser", { name });

    socket.on("disconnect", async () => {
      if (socket.isAnfitrion) {
        await sessionFinish(room);
        console.log("Finalizando la session: ", room);
      }
      socket
        .to(room)
        .emit("logout", { user: name, uid, exit: socket.isAnfitrion });
      console.log("Cliente desconectado - ", socket.name);
    });

    console.log("----------FIN DE SOCKET--------------");
  });
};

module.exports = socketController;
