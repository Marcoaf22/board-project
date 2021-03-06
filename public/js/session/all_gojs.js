const init = (socket) => {
  console.log("Se INICIO INIT");

  var $ = go.GraphObject.make; // for conciseness in defining templates
  myDiagram = $(
    go.Diagram,
    "myDiagramDiv", // must name or refer to the DIV HTML element
    {
      mouseOver: function (e) {
        // console.log(e.viewPoint);
        // console.log(e.viewPoint.toString());
      },
      // LinkDrawn: showLinkLabel, // this DiagramEvent listener is defined below
      // LinkRelinked: showLinkLabel,
      "commandHandler.archetypeGroupData": {
        text: "Group",
        isGroup: true,
        color: "blue",
      },
      "undoManager.isEnabled": true, // enable undo & redo
    }
  );

  // GOBINDING LOCATION
  function nodeStyle() {
    return [
      // The Node.location comes from the "loc" property of the node data,
      // converted by the Point.parse static method.
      // If the Node.location is changed, it updates the "loc" property of the node data,
      // converting back using the Point.stringify static method.
      new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
        go.Point.stringify
      ),
      {
        // the Node.location is at the center of each node
        locationSpot: go.Spot.Center,
      },
    ];
  }
  function textStyle() {
    return {
      font: "bold 11pt Lato, Helvetica, Arial, sans-serif",
      stroke: "#F8F8F8",
    };
  }
  function textStyleMin() {
    return {
      font: "9pt Lato, Helvetica, Arial, sans-serif",
      stroke: "#F8F8F8",
    };
  }
  function textStyleMid() {
    return {
      font: "8pt Lato, Helvetica, Arial, sans-serif",
      stroke: "#F8F8F8",
    };
  }

  // taken from ../extensions/Figures.js:
  // ASIGNAMOS UNA NUEVA FIGURA
  go.Shape.defineFigureGenerator("File", function (shape, w, h) {
    var geo = new go.Geometry();
    var fig = new go.PathFigure(0, 0, true); // starting point
    geo.add(fig);
    fig.add(new go.PathSegment(go.PathSegment.Line, 0.75 * w, 0));
    fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.25 * h));
    fig.add(new go.PathSegment(go.PathSegment.Line, w, h));
    fig.add(new go.PathSegment(go.PathSegment.Line, 0, h).close());
    var fig2 = new go.PathFigure(0.75 * w, 0, false);
    geo.add(fig2);
    // The Fold
    fig2.add(new go.PathSegment(go.PathSegment.Line, 0.75 * w, 0.25 * h));
    fig2.add(new go.PathSegment(go.PathSegment.Line, w, 0.25 * h));
    geo.spot1 = new go.Spot(0, 0.25);
    geo.spot2 = go.Spot.BottomRight;
    return geo;
  });

  myDiagram.nodeTemplateMap.add(
    "Comment",
    $(
      go.Node,
      "Auto",
      nodeStyle(),
      $(go.Shape, "File", {
        fill: "#F4F798",
        stroke: "#DEE0A3",
        strokeWidth: 3,
      }),
      $(
        go.TextBlock,
        {
          font: "10pt Lato, Helvetica, Arial, sans-serif",
          stroke: "#000000",
        },
        {
          margin: 8,
          maxSize: new go.Size(200, NaN),
          wrap: go.TextBlock.WrapFit,
          textAlign: "center",
          editable: true,
        },
        new go.Binding("text").makeTwoWay()
      )
      // no ports, because no links are allowed to connect with a comment
    )
  );

  // Person
  myDiagram.nodeTemplateMap.add(
    "Person",
    $(
      go.Node,
      "Vertical",
      nodeStyle(),
      $(go.Shape, "Circle", {
        width: 70,
        stroke: "#08427B",
        fill: "#08427B",
        strokeWidth: 3,
      }),
      $(
        go.Panel,
        "Auto",
        $(go.Shape, "RoundedRectangle", {
          width: 160,
          height: 100,
          fill: "#08427B",
          stroke: "#08427B",
          strokeWidth: 3,
          portId: "",
          fromLinkable: true,
          toLinkable: true,
        }),
        $(
          go.Panel,
          "Vertical",
          $(
            go.TextBlock,
            textStyle(),
            {
              margin: (0, 5, 0, 0),
              maxSize: new go.Size(200, NaN),
              wrap: go.TextBlock.WrapFit,
              textAlign: "center",
              text: "Software System",
              editable: true,
            },
            new go.Binding("text", "txt-t").makeTwoWay()
          ),
          $(go.TextBlock, textStyleMid(), {
            margin: 2,
            maxSize: new go.Size(200, NaN),
            wrap: go.TextBlock.WrapFit,
            text: "[Person]",
            textAlign: "center",
          }),
          $(go.Shape, "RoundedRectangle", {
            width: 20,
            height: 10,
            fill: "#08427B",
            stroke: "#08427B",
          }),
          $(
            go.TextBlock,
            textStyleMin(),
            {
              // margin: 3,
              width: 150,
              maxSize: new go.Size(200, NaN),
              wrap: go.TextBlock.WrapFit,
              textAlign: "center",
              text: "Stores all of the core banking information about coustomers, accounts,",
              editable: true,
            },
            new go.Binding("text", "txt-b").makeTwoWay()
          ),
          new go.Binding("itemArray", "items")
        ),
        new go.Binding("itemArray", "items-main")
      )
    )
  );

  // Sofftware system
  myDiagram.nodeTemplateMap.add(
    "System",
    $(
      go.Node,
      "Auto",
      nodeStyle(),
      $(go.Shape, "Rectangle", {
        width: 160,
        height: 120,
        fill: "#1168BD",
        stroke: "#1168BD",
        strokeWidth: 3,
        portId: "",
        fromLinkable: true,
        toLinkable: true,
      }),
      $(
        go.Panel,
        "Vertical",
        $(
          go.TextBlock,
          textStyle(),
          {
            maxSize: new go.Size(200, NaN),
            wrap: go.TextBlock.WrapFit,
            textAlign: "center",
            text: "Email",
            editable: true,
          },
          new go.Binding("text", "txt-t").makeTwoWay()
        ),
        $(go.TextBlock, textStyleMid(), {
          margin: 2,
          text: "Software System",
          maxSize: new go.Size(200, NaN),
          wrap: go.TextBlock.WrapFit,
          text: "[Software System]",
          textAlign: "center",
          // editable: true,
        }),
        $(go.Shape, "RoundedRectangle", {
          width: 20,
          height: 10,
          fill: "#1168BD",
          stroke: "#1168BD",
        }),
        $(
          go.TextBlock,
          textStyleMin(),
          {
            width: 150,
            margin: 2,
            maxSize: new go.Size(200, NaN),
            wrap: go.TextBlock.WrapFit,
            textAlign: "center",
            text: "Text Example",
            editable: true,
          },
          new go.Binding("text", "txt-b").makeTwoWay()
        ),
        new go.Binding("itemArray", "items")
      )
    )
  );

  // Sofftware SubSystem
  myDiagram.nodeTemplateMap.add(
    "SubSystem",
    $(
      go.Node,
      "Auto",
      nodeStyle(),
      $(go.Shape, "Rectangle", {
        width: 160,
        height: 120,
        fill: "#999999",
        stroke: "#999999",
        strokeWidth: 3,
        portId: "",
        fromLinkable: true,
        toLinkable: true,
      }),
      $(
        go.Panel,
        "Vertical",
        $(
          go.TextBlock,
          textStyle(),
          {
            maxSize: new go.Size(200, NaN),
            wrap: go.TextBlock.WrapFit,
            textAlign: "center",
            text: "Email",
            editable: true,
          },
          new go.Binding("text", "txt-t").makeTwoWay()
        ),
        $(
          go.TextBlock,
          textStyleMid(),
          {
            margin: 2,
            text: "holamundo",
            maxSize: new go.Size(200, NaN),
            wrap: go.TextBlock.WrapFit,
            text: "[Software System]",
            textAlign: "center",
            // editable: true,
          }
          // new go.Binding("text", "txt-md").makeTwoWay()
        ),
        $(go.Shape, "RoundedRectangle", {
          width: 20,
          height: 10,
          fill: "#999999",
          stroke: "#999999",
        }),
        $(
          go.TextBlock,
          textStyleMin(),
          {
            width: 150,
            margin: 2,
            maxSize: new go.Size(200, NaN),
            wrap: go.TextBlock.WrapFit,
            textAlign: "center",
            text: "Text Example",
            editable: true,
          },
          new go.Binding("text", "txt-b").makeTwoWay()
        ),
        new go.Binding("itemArray", "items")
      )
    )
  );

  myDiagram.linkTemplate = $(
    go.Link, // the whole link panel
    $(go.Shape, { strokeDashArray: [20, 18] }), // the link shape, default black stroke
    $(
      go.Shape, // the arrowhead
      { toArrow: "Standard" }
    ),
    $(
      go.Panel,
      "Auto", // this whole Panel is a link label
      $(go.Shape, "Rectangle", { fill: "transparent", stroke: "transparent" }),
      $(
        go.TextBlock,
        {
          margin: 3,
          text: "Example",
          editable: true,
          font: "bold 10pt sans-serif",
        },
        new go.Binding("text", "txt-l").makeTwoWay()
      ),
      new go.Binding("itemArray", "items")
    )
  );

  // initialize the Palette that is on the left side of the page
  myPalette = $(
    go.Palette,
    "myPaletteDiv", // must name or refer to the DIV HTML element
    {
      // Instead of the default animation, use a custom fade-down
      "animationManager.initialAnimationStyle": go.AnimationManager.None,
      // InitialAnimationStarting: animateFadeDown, // Instead, animate with this function
      nodeTemplateMap: myDiagram.nodeTemplateMap, // share the templates used by myDiagram
      model: new go.GraphLinksModel([
        // specify the contents of the Palette
        {
          category: "Comment",
          text: "Comment",
        },
        {
          category: "Person",
          text: "Person",
        },
        {
          category: "System",
          text: "Sistema",
        },
        {
          category: "SubSystem",
          text: "Sistema",
        },
      ]),
    }
  );

  function animateFadeDown(e) {
    var diagram = e.diagram;
    var animation = new go.Animation();
    animation.isViewportUnconstrained = true; // So Diagram positioning rules let the animation start off-screen
    animation.easing = go.Animation.EaseOutExpo;
    animation.duration = 900;
    // Fade "down", in other words, fade in from above
    animation.add(
      diagram,
      "position",
      diagram.position.copy().offset(0, 200),
      diagram.position
    );
    animation.add(diagram, "opacity", 0, 1);
    animation.start();
  }

  // Show the diagram's model in JSON format that the user may edit
  function save() {
    document.getElementById("mySavedModel").value = myDiagram.model.toJson();
    myDiagram.isModified = false;
  }

  function load() {
    myDiagram.model = go.Model.fromJson(
      document.getElementById("mySavedModel").value
    );
  }

  // let seend = false;
  let testEvent = true;
  const btnSave = document.getElementById("btnSave");
  const btnLoad = document.getElementById("btnLoad");

  btnSave.addEventListener("click", async (e) => {
    const { value: name } = await Swal.fire({
      title: "Guardar diagrama",
      input: "text",
      inputLabel: "Escribe el nombre",
      showCancelButton: true,
    });

    if (name) {
      // console.log("guardando: ", name);
      socket.emit("guardar diagrama", name);
      console.log(myDiagram.model.toJson());
      // alertify.success("Diagrama guardado");

      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
      });

      Toast.fire({
        icon: "success",
        title: "Diagrama guardado correctamente",
      });
    }
  });

  if (btnLoad) {
    btnLoad.addEventListener("click", (e) => {
      socket.emit("cargar diagramas", (diagramas) => {
        select();
        console.log(diagramas);
      });
    });
  }

  socket.on("holamundo", (data) => {
    console.log(data.sid);
    console.log("ESCUCHANDO HOLA MUNDO");
    if (btnLoad) {
      socket.emit("enviarDiagrama", data);
    }
  });

  document.getElementById("btnExit").addEventListener("click", (e) => {
    Swal.fire({
      title: "??Estas seguro de salir?",
      showCancelButton: true,
      confirmButtonText: `Salir`,
    }).then((result) => {
      if (result.isConfirmed) {
        window.location = "/home";
      }
    });
  });

  const select = () => {
    socket.emit("cargar diagramas", async (data) => {
      const diagr = data.map((data, i) => data.name);
      const { value } = await Swal.fire({
        title: "Elije un diagrama",
        input: "select",
        inputOptions: diagr,
        inputAttributes: { max: 98 },
        inputPlaceholder: "Selecciona un diagrama",
        showCancelButton: true,
      });
      // if( )
      console.log(" " + value);
      console.log(data);
      testEvent = false;
      console.log(data[value]);
      const newDiagrama = JSON.parse(data[value].data);
      myDiagram.model = go.Model.fromJson(newDiagrama);
      socket.emit("select diagrama", newDiagrama);
      testEvent = true;
    });
  };

  socket.on("nuevo diagrama", (data) => {
    testEvent = false;
    myDiagram.model = go.Model.fromJson(data);
    testEvent = true;
  });

  const cargarDiagrama = (dato) => {
    console.log("EJECUTANDO EL PRIMERO CARGAR DIAGRAMA");
    if (dato) {
      testEvent = false;
      myDiagram.model = go.Model.fromJson(dato);
      testEvent = true;
    } else {
      socket.emit("cargar_diagrama", (data) => {
        console.log("CARGANDO DIAGRAMA COMPLETO");
        testEvent = false;
        myDiagram.model = go.Model.fromJson(data);
        testEvent = true;
      });
    }
  };

  // cargarDiagrama();
  // var one = false;
  myDiagram.addModelChangedListener(function (e) {
    if (e.isTransactionFinished && testEvent) {
      console.log("EMITIENDO EVENTO: DIAGRAMA");
      let completo = e.model.toJson();
      var parcial = e.model.toIncrementalJson(e);
      socket.emit("diagrama", parcial, completo);
    }
    // one = true;
  });

  socket.on("cargar_diagrama", (data) => {
    console.log("CARGANDO DIAGRAMA COMPLETO");
    testEvent = false;
    myDiagram.model = go.Model.fromJson(data);
    testEvent = true;
  });

  socket.on("diagrama", (data) => {
    // console.log("SOCKET: 'DIAGRAMA'");
    testEvent = false;
    // console.log("EVENT TEST: " + testEvent);
    cargar(data);
    testEvent = true;
    // console.log("EVENT TEST final: " + testEvent);
    // }
  });

  const cargar = (data) => {
    myDiagram.model.applyIncrementalJson(data);
  };

  testEvent = false;
  var graph = new go.GraphLinksModel();
  graph.linkKeyProperty = "idForIncrement";
  myDiagram.model = graph;
  testEvent = true;

  socket.on("isAnfitrion", (data) => {
    console.log("EVENTO: ISANFITRION");
    console.log(data);
    if (!data.data) {
      console.log("ejecutando cargar diagrama desde isAnfitrion");
      cargarDiagrama(data.dato);
    }
    console.log("soy un anfitrion ", data.data);
    console.log("EVENTO FINISH: ISANFITRION");
  });

  socket.on("recibilo", (dato) => {
    console.log("EVENTO: RECIBILO ");
    console.log(dato);
    cargarDiagrama(dato);
  });

  // PARA GUARDAR IMAGEN, SVG
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

  document
    .getElementById("saveImage")
    .addEventListener("click", (e) => makeBlob());

  document
    .getElementById("saveSVG")
    .addEventListener("click", (e) => makeSvg());

  // cargarDiagrama();

  const newUser = (id, name, img) => {
    return `<div class="flex flex-col w-full" id="${id}">
    <div class="cursor-pointer w-full border-gray-100 rounded-t border-b hover:bg-teal-100">
      <div
        class="flex w-full items-center p-2 pl-2 border-transparent border-l-2 relative hover:border-teal-100">
        <div class="w-6 flex flex-col items-center">
          <div
            class="flex relative w-5 h-5 bg-orange-500 justify-center items-center m-1 mr-2 w-4 h-4 mt-1 rounded-full ">
            <img class="rounded-full" alt="A"
              src="${
                img
                  ? img
                  : "https://www.seekpng.com/png/detail/73-730482_existing-user-default-avatar.png"
              }">
          </div>
        </div>
        <div class="w-full items-center flex">
          <div class="mx-2 -mt-1  ">${name}
          </div>
        </div>
      </div>
    </div>
  </div>`;
  };

  socket.on("login", (data) => {
    const ele = document.createElement("DIV");

    ele.classList.add("flex", "flex-col", "w-full");
    ele.innerHTML = newUser(data.uid, data.user, data.img);

    const list = document.getElementById("usuarios-conectados");
    list.appendChild(ele);
    // socket.emit("enviar_first_diagrama", { msg: "hola" });
    alertify.notify(data.user + " se ha unido", "custom", 2);
  });

  socket.on("logout", (data) => {
    console.log(data);
    if (data.exit) {
      setTimeout(() => {
        window.location = "/home";
      }, 3000);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "La sesion ha terminado!",
      });
    } else {
      let ele = document.getElementById(data.uid);
      let padre = ele.parentNode;
      padre.removeChild(ele);
      alertify.notify(data.user + " se ha desconectado", "custo2", 2);
    }
  });
};
