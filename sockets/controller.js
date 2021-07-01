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

    socket.join(room, uid);

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

    // socket.emit("isAnfitrion", { data: socket.isAnfitrion });

    // console.log("DEFINIENDO EL EVENTO TESTO");
    // socket.on("testo", async (data) => {
    //   console.log("escuchando testo");
    //   console.log(data);
    // });

    // console.log("emitiendo soy_anfitrion");
    // socket.emit("soy_anfitrion", { uid });

    socket.on("select diagrama", (data) => {
      if (socket.isAnfitrion) {
        console.log("EVENTO: SELECT DIAGRAM");
        io.diagrama = data;
        diagrama = data;
        socket.to(room).emit("nuevo diagrama", io.diagrama);
      }
    });
    let bool = false;
    socket.on("diagrama", (lastChanged, complet) => {
      if (bool) {
        console.log("EVENTO: DIAGRAMA - ", socket.name);
        console.log("IO");
        console.log(io.diagrama);
        console.log("VAR");
        console.log(diagrama);
        console.log("------------------------------------------------");
        console.log(lastChanged);
        console.log(complet);
        io.diagrama = complet;
        diagrama = complet;
        console.log("------------------------------------------------");

        socket.to(room).emit("diagrama", lastChanged);
        console.log("EVENTO FINISH: DIAGRAMA - ", socket.name);
      }
      bool = true;
    });

    // socket.on("enviar_diagrama", (data) => {
    //   console.log("EVENT: ENVIAR_DIAGRAMA");
    //   socket.to(data.id).emit("cargar_primer_diagrama", io.diagrama);
    // });

    socket.to(room).emit("login", { user: name, uid, img, _id: socket.id });

    socket.to(room).emit("holamundo", { sid: socket.id });

    socket.on("enviarDiagrama", (data) => {
      console.log("EVENTO: ENVIARDIAGRAMA INICIO - ", socket.name);

      console.log("LOS DATOS A ENVIAR");
      console.log(io.diagrama);
      console.log(diagrama);
      socket.to(data.sid).emit("recibilo", io.diagrama);
      console.log("EVENTO: ENVIARDIAGRAMA FINAL", socket.name);
    });

    socket.on("recibilo", (data) => {
      console.log("EVENTO: RECIBILO ", socket.name);
    });

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
