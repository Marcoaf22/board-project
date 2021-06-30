myDiagram.addModelChangedListener(function (e) {
  // console.log("EVENT ADDMODELCHANGED");
  // console.log("Enviar: " + seend);
  if (e.isTransactionFinished && testEvent) {
    let json = e.model.toJson();
    var diagr = e.model.toIncrementalJson(e);
    // console.log(diagr);
    // if (seend) {
    // console.log("EVENT TEST: " + testEvent);
    socket.emit("diagrama", diagr, json);
    // }
  }
});

socket.on("cargar_diagrama", (data) => {
  console.log("CARGANDO DIAGRAMA COMPLETO");
  testEvent = false;
  myDiagram.model = go.Model.fromJson(data);
  testEvent = true;
});

socket.on("diagrama", (data) => {
  console.log("SOCKET 'DIAGRAMA'");
  testEvent = false;
  console.log("EVENT TEST: " + testEvent);
  cargar(data);
  testEvent = true;
  console.log("EVENT TEST final: " + testEvent);
});

const cargar = (data) => {
  // myDiagram.model = go.Model.fromJson(data);
  myDiagram.model.applyIncrementalJson(data);
};

function myCallbackBlob(blob) {
  var url = window.URL.createObjectURL(blob);
  var filename = "myBlobFile.png";

  var a = document.createElement("a");
  a.style = "display: none";
  a.href = url;
  a.download = filename;

  // IE 11
  if (window.navigator.msSaveBlob !== undefined) {
    window.navigator.msSaveBlob(blob, filename);
    return;
  }

  document.body.appendChild(a);
  requestAnimationFrame(function () {
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  });
}

function makeBlob() {
  var blob = myDiagram.makeImageData({
    background: "white",
    returnType: "blob",
    callback: myCallbackBlob,
  });
}

function myCallback(blob) {
  var url = window.URL.createObjectURL(blob);
  var filename = "mySVGFile.svg";

  var a = document.createElement("a");
  a.style = "display: none";
  a.href = url;
  a.download = filename;

  // IE 11
  if (window.navigator.msSaveBlob !== undefined) {
    window.navigator.msSaveBlob(blob, filename);
    return;
  }

  document.body.appendChild(a);
  requestAnimationFrame(function () {
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  });
}

function makeSvg() {
  var svg = myDiagram.makeSvg({ scale: 1, background: "white" });
  var svgstr = new XMLSerializer().serializeToString(svg);
  var blob = new Blob([svgstr], { type: "image/svg+xml" });
  myCallback(blob);
}
