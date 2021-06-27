console.log("Carga JOINT");

var graph = new joint.dia.Graph();

var paper = new joint.dia.Paper({
  el: document.getElementById("myholder"),
  model: graph,
  width: 800,
  height: 400,
  gridSize: 1,
});

var rect = new joint.shapes.standard.Rectangle();
rect.position(100, 30);
rect.resize(100, 40);
rect.attr({
  body: {
    fill: "blue",
  },
  label: {
    text: "Hello",
    fill: "white",
  },
});
rect.addTo(graph);

var rect2 = rect.clone();
rect2.translate(300, 0);
rect2.attr("label/text", "World!");
rect2.addTo(graph);

var link = new joint.shapes.standard.Link();
link.source(rect);
link.target(rect2);
link.addTo(graph);
