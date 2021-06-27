var url = window.location.hostname.includes("localhost")
  ? "http://localhost:8080/"
  : "https://restserver-curso-fher.herokuapp.com/";

axios
  .post(
    url + "session",
    { id: window.location.pathname.split("/")[2] },
    { withCredentials: true }
  )
  .then((e) => {
    console.log("PETICION AXIOS BASCI_GOJS");
    console.log(e.data);
    let { user, session } = e.data;

    init(session, user);
  })
  .catch((e) => {
    console.log("ERROR al obtener datos de la session");
  });

function init(session, user) {
  console.log("Basic.js carago ez ");

  var $ = go.GraphObject.make; // for conciseness in defining templates

  // $(go.Diagram, "myDiagramDiv", {});

  myDiagram = $(
    go.Diagram,
    "myDiagramDiv", // create a Diagram for the DIV HTML element
    {
      mouseOver: function (e) {
        // console.log(e.viewPoint.toString());
      },
      // allow double-click in background to create a new node
      "clickCreatingTool.archetypeNodeData": { text: "Node", color: "white" },

      // allow Ctrl-G to call groupSelection()
      "commandHandler.archetypeGroupData": {
        text: "Group",
        isGroup: true,
        color: "blue",
      },

      // enable undo & redo
      "undoManager.isEnabled": true,
    }
  );

  // myDiagram.addModelChangedListener((e) => {
  //   console.log("hola desde el listener");
  //   e.model.toJson();
  // });

  // let seend = false;
  let testEvent = true;
  const btnSave = document.getElementById("btn3");
  const btnLoad = document.getElementById("btn4");

  btnSave.addEventListener("click", async (e) => {
    // alertify.prompt(
    //   "Guardar diagrama",
    //   "Escriba el nombre del diagrama",
    //   "",
    //   function (evt, value) {
    //     console.log("guardando: ", value);
    //     socket.emit("guardar diagrama", value);
    //     alertify.success("Diagrama guardado");
    //   },
    //   function () {
    //     alertify.error("Cancel");
    //   }
    // );

    const { value: name } = await Swal.fire({
      title: "Guardar diagrama",
      input: "text",
      inputLabel: "Escribe el nombre",
      showCancelButton: true,
    });

    if (name) {
      console.log("guardando: ", name);
      socket.emit("guardar diagrama", name);
      alertify.success("Diagrama guardado");

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

  btnLoad.addEventListener("click", (e) => {
    socket.emit("cargar diagramas", (diagramas) => {
      select();
      console.log(diagramas);
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

  // var socket = io({
  //   auth: {
  //     room: window.location.pathname.split("/")[2],
  //     uid: user,
  //   },
  // });

  console.log("COMPARANDO");
  console.log(user.uid);
  console.log(session.user_id);

  const cargarDiagrama = () => {
    console.log("EJECUTANDO EL PRIMERO CARGARDIAGRAMA");
    socket.emit("cargar_diagrama", (data) => {
      console.log("CARGANDO DIAGRAMA COMPLETO");
      testEvent = false;
      myDiagram.model = go.Model.fromJson(data);
      testEvent = true;
    });
  };

  if (user.uid == session.user_id) {
    console.log("true");
    // socket.emit("select diagram", myDiagram.model.toJson());
  } else {
    console.log("why");
    cargarDiagrama();
    console.log("false");
    // socket.emit("cargar_diagrama", (data) => {
    //   console.log("CARGANDO DIAGRAMA COMPLETO");
    //   testEvent = false;
    //   myDiagram.model = go.Model.fromJson(data);
    //   testEvent = true;
    // });
  }

  // socket.on("cargar_diagrama", (data) => {
  //   console.log("CARGANDO DIAGRAMA COMPLETO");
  //   testEvent = false;
  //   myDiagram.model = go.Model.fromJson(data);
  //   testEvent = true;
  // });

  myDiagram.addModelChangedListener(function (e) {
    console.log("EVENT ADDMODELCHANGED");
    // console.log("Enviar: " + seend);
    if (e.isTransactionFinished && testEvent) {
      let json = e.model.toJson();
      var diagr = e.model.toIncrementalJson(e);
      console.log(diagr);
      // if (seend) {
      console.log("EVENT TEST: " + testEvent);
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
    // }
  });

  const cargar = (data) => {
    // myDiagram.model = go.Model.fromJson(data);
    myDiagram.model.applyIncrementalJson(data);
    //setTimeout(cargar, 300);
  };

  // socket.once("diagrama", (data) => {
  //   console.log("En el evento diagrama");
  //   var modelAsText = data;
  //   myDiagram.removeModelChangedListener((e) => {
  //     console.log("DESDE REMOVER");
  //   });
  //   myDiagram.model = go.Model.fromJson(modelAsText);
  // });

  // Define the appearance and behavior for Nodes:

  // First, define the shared context menu for all Nodes, Links, and Groups.

  // To simplify this code we define a function for creating a context menu button:
  function makeButton(text, action, visiblePredicate) {
    return $(
      "ContextMenuButton",
      $(go.TextBlock, text),
      { click: action },
      // don't bother with binding GraphObject.visible if there's no predicate
      visiblePredicate
        ? new go.Binding("visible", "", function (o, e) {
            return o.diagram ? visiblePredicate(o, e) : false;
          }).ofObject()
        : {}
    );
  }

  // a context menu is an Adornment with a bunch of buttons in them
  var partContextMenu = $(
    "ContextMenu",
    makeButton("Properties", function (e, obj) {
      // OBJ is this Button
      var contextmenu = obj.part; // the Button is in the context menu Adornment
      var part = contextmenu.adornedPart; // the adornedPart is the Part that the context menu adorns
      // now can do something with PART, or with its data, or with the Adornment (the context menu)
      if (part instanceof go.Link) alert(linkInfo(part.data));
      else if (part instanceof go.Group) alert(groupInfo(contextmenu));
      else alert(nodeInfo(part.data));
    }),
    makeButton(
      "Cut",
      function (e, obj) {
        e.diagram.commandHandler.cutSelection();
      },
      function (o) {
        return o.diagram.commandHandler.canCutSelection();
      }
    ),
    makeButton(
      "Copy",
      function (e, obj) {
        e.diagram.commandHandler.copySelection();
      },
      function (o) {
        return o.diagram.commandHandler.canCopySelection();
      }
    ),
    makeButton(
      "Paste",
      function (e, obj) {
        e.diagram.commandHandler.pasteSelection(
          e.diagram.toolManager.contextMenuTool.mouseDownPoint
        );
      },
      function (o) {
        return o.diagram.commandHandler.canPasteSelection(
          o.diagram.toolManager.contextMenuTool.mouseDownPoint
        );
      }
    ),
    makeButton(
      "Delete",
      function (e, obj) {
        e.diagram.commandHandler.deleteSelection();
      },
      function (o) {
        return o.diagram.commandHandler.canDeleteSelection();
      }
    ),
    makeButton(
      "Undo",
      function (e, obj) {
        e.diagram.commandHandler.undo();
      },
      function (o) {
        return o.diagram.commandHandler.canUndo();
      }
    ),
    makeButton(
      "Redo",
      function (e, obj) {
        e.diagram.commandHandler.redo();
      },
      function (o) {
        return o.diagram.commandHandler.canRedo();
      }
    ),
    makeButton(
      "Group",
      function (e, obj) {
        e.diagram.commandHandler.groupSelection();
      },
      function (o) {
        return o.diagram.commandHandler.canGroupSelection();
      }
    ),
    makeButton(
      "Ungroup",
      function (e, obj) {
        e.diagram.commandHandler.ungroupSelection();
      },
      function (o) {
        return o.diagram.commandHandler.canUngroupSelection();
      }
    )
  );

  function nodeInfo(d) {
    // Tooltip info for a node data object
    var str = "Node " + d.key + ": " + d.text + "\n";
    if (d.group) str += "member of " + d.group;
    else str += "top-level node";
    return str;
  }

  // These nodes have text surrounded by a rounded rectangle
  // whose fill color is bound to the node data.
  // The user can drag a node by dragging its TextBlock label.
  // Dragging from the Shape will start drawing a new link.
  myDiagram.nodeTemplate = $(
    go.Node,
    "Auto",
    { locationSpot: go.Spot.Center },
    new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
      go.Point.stringify
    ),
    $(
      go.Shape,
      "RoundedRectangle",
      {
        fill: "white", // the default fill, if there is no data bound value
        portId: "",
        cursor: "pointer", // the Shape is the port, not the whole Node
        // allow all kinds of links from and to this port
        fromLinkable: true,
        fromLinkableSelfNode: false,
        fromLinkableDuplicates: true,
        toLinkable: true,
        toLinkableSelfNode: true,
        toLinkableDuplicates: true,
      },
      new go.Binding("fill", "color")
    ),
    $(
      go.TextBlock,
      {
        font: "bold 14px sans-serif",
        stroke: "#333",
        margin: 6, // make some extra space for the shape around the text
        isMultiline: false, // don't allow newlines in text
        editable: true, // allow in-place editing by user
      },
      new go.Binding("text", "text").makeTwoWay()
    ), // the label shows the node data's text
    {
      // this tooltip Adornment is shared by all nodes
      toolTip: $(
        "ToolTip",
        $(
          go.TextBlock,
          { margin: 4 }, // the tooltip shows the result of calling nodeInfo(data)
          new go.Binding("text", "", nodeInfo)
        )
      ),
      // this context menu Adornment is shared by all nodes
      contextMenu: partContextMenu,
    }
  );

  // Define the appearance and behavior for Links:

  function linkInfo(d) {
    // Tooltip info for a link data object
    return "Link:\nfrom " + d.from + " to " + d.to;
  }

  // myDiagram.nodeTemplate = $(
  //   go.Node,
  //   "Auto",
  //   new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
  //     go.Point.stringify
  //   )
  // );

  // The link shape and arrowhead have their stroke brush data bound to the "color" property
  myDiagram.linkTemplate = $(
    go.Link,
    { toShortLength: 3, relinkableFrom: true, relinkableTo: true },
    new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
      go.Point.stringify
    ), // allow the user to relink existing links
    $(go.Shape, { strokeWidth: 2 }, new go.Binding("stroke", "color")),
    $(
      go.Shape,
      { toArrow: "Standard", stroke: null },
      new go.Binding("fill", "color")
    ),
    {
      // this tooltip Adornment is shared by all links
      toolTip: $(
        "ToolTip",
        $(
          go.TextBlock,
          { margin: 4 }, // the tooltip shows the result of calling linkInfo(data)
          new go.Binding("text", "", linkInfo)
        )
      ),
      // the same context menu Adornment is shared by all links
      contextMenu: partContextMenu,
    }
  );

  // Define the appearance and behavior for Groups:

  function groupInfo(adornment) {
    // takes the tooltip or context menu, not a group node data object
    var g = adornment.adornedPart; // get the Group that the tooltip adorns
    var mems = g.memberParts.count;
    var links = 0;
    g.memberParts.each(function (part) {
      if (part instanceof go.Link) links++;
    });
    return (
      "Group " +
      g.data.key +
      ": " +
      g.data.text +
      "\n" +
      mems +
      " members including " +
      links +
      " links"
    );
  }

  // Groups consist of a title in the color given by the group node data
  // above a translucent gray rectangle surrounding the member parts
  myDiagram.groupTemplate = $(
    go.Group,
    "Vertical",
    {
      selectionObjectName: "PANEL", // selection handle goes around shape, not label
      ungroupable: true, // enable Ctrl-Shift-G to ungroup a selected Group
    },
    $(
      go.TextBlock,
      {
        //alignment: go.Spot.Right,
        font: "bold 19px sans-serif",
        isMultiline: false, // don't allow newlines in text
        editable: true, // allow in-place editing by user
      },
      new go.Binding("text", "text").makeTwoWay(),
      new go.Binding("stroke", "color")
    ),
    $(
      go.Panel,
      "Auto",
      { name: "PANEL" },
      $(
        go.Shape,
        "Rectangle", // the rectangular shape around the members
        {
          fill: "rgba(128,128,128,0.2)",
          stroke: "gray",
          strokeWidth: 3,
          portId: "",
          cursor: "pointer", // the Shape is the port, not the whole Node
          // allow all kinds of links from and to this port
          fromLinkable: true,
          fromLinkableSelfNode: true,
          fromLinkableDuplicates: true,
          toLinkable: true,
          toLinkableSelfNode: true,
          toLinkableDuplicates: true,
        }
      ),
      $(go.Placeholder, { margin: 10, background: "transparent" }) // represents where the members are
    ),
    {
      // this tooltip Adornment is shared by all groups
      toolTip: $(
        "ToolTip",
        $(
          go.TextBlock,
          { margin: 4 },
          // bind to tooltip, not to Group.data, to allow access to Group properties
          new go.Binding("text", "", groupInfo).ofObject()
        )
      ),
      // the same context menu Adornment is shared by all groups
      contextMenu: partContextMenu,
    }
  );

  // Define the behavior for the Diagram background:

  function diagramInfo(model) {
    // Tooltip info for the diagram's model
    return (
      "Model:\n" +
      model.nodeDataArray.length +
      " nodes, " +
      model.linkDataArray.length +
      " links"
    );
  }

  // provide a tooltip for the background of the Diagram, when not over any Part
  myDiagram.toolTip = $(
    "ToolTip",
    $(go.TextBlock, { margin: 4 }, new go.Binding("text", "", diagramInfo))
  );

  // provide a context menu for the background of the Diagram, when not over any Part
  myDiagram.contextMenu = $(
    "ContextMenu",
    makeButton(
      "Paste",
      function (e, obj) {
        e.diagram.commandHandler.pasteSelection(
          e.diagram.toolManager.contextMenuTool.mouseDownPoint
        );
      },
      function (o) {
        return o.diagram.commandHandler.canPasteSelection(
          o.diagram.toolManager.contextMenuTool.mouseDownPoint
        );
      }
    ),
    makeButton(
      "Undo",
      function (e, obj) {
        e.diagram.commandHandler.undo();
      },
      function (o) {
        return o.diagram.commandHandler.canUndo();
      }
    ),
    makeButton(
      "Redo",
      function (e, obj) {
        e.diagram.commandHandler.redo();
      },
      function (o) {
        return o.diagram.commandHandler.canRedo();
      }
    )
  );

  // Create the Diagram's Model:
  var nodeDataArray = [
    { key: 1, text: "Alpha", color: "lightblue" },
    { key: 2, text: "Beta", color: "orange" },
    { key: 3, text: "Gamma", color: "lightgreen", group: 5 },
    { key: 4, text: "Delta", color: "red", group: 5 },
    { key: 5, text: "Epsilon", color: "green", isGroup: true },
  ];
  var linkDataArray = [
    { from: 1, to: 2, color: "blue" },
    { from: 2, to: 2 },
    { from: 3, to: 4, color: "green" },
    { from: 3, to: 1, color: "purple" },
  ];

  // myDiagram.model.linkKeyProperty = "idForIncrement";
  // var graph = new go.GraphLinksModel(nodeDataArray, linkDataArray);
  var graph = new go.GraphLinksModel();
  graph.linkKeyProperty = "idForIncrement";
  myDiagram.model = graph;
  // myDiagram.model = new go.GraphLinksModel({
  //   // linkKeyProperty: "id", // or whatever name it is that you are using
  //   nodeDataArray: nodeDataArray,
  //   linkDataArray: linkDataArray,
  // });
}

// window.addEventListener("DOMContentLoaded", init);
