// var diagrama;
// document.getElementById("btn").addEventListener("click", (e) => {
//   console.log("SAVING");
//   diagrama = graph.toJSON();
//   console.log(graph.toJSON());
// });

// document.getElementById("btn2").addEventListener("click", (e) => {
//   console.log("LOADING");
//   console.log(diagrama);
//   cargar();
// });

// const cargar = () => {
//   graph.fromJSON(diagrama);

//   //setTimeout(cargar, 300);
// };

// ----------------GOJS-------------

var diagrama;
document.getElementById("btn").addEventListener("click", (e) => {
  console.log("SAVING");
  diagrama = myDiagram.model.toJson();
  console.log(diagrama);
  // console.log(seend);
});

document.getElementById("btn2").addEventListener("click", (e) => {
  console.log("LOADING");
  console.log(diagrama);
  cargar(diagrama);
});
console.log(socket);
console.log(socket.id);
socket.on("login", (data) => {
  // alertify.success(data.user + " se ha unido");
  alertify.notify(data.user + " se ha unido", "custom", 2, function () {
    console.log("dismissed");
  });
});
