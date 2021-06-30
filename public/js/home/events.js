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
  alertify.notify(data.user + " se ha unido", "custom", 2);
  //   // console.log("dismissed");

  // });

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    background: "#FF0000",
    textColor: "#ffffff",
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  Toast.fire({
    title: "Signed in successfully",
  });
});

socket.on("logout", (data) => {
  // alertify.success(data.user + " se ha unido");
  alertify.error(data.user + " se ha salido");
});
