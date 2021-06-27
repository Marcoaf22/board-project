console.log("DESDE SOCKET-CLIENT.JS");
var socket = io({
  auth: {
    room: window.location.pathname.split("/")[2],
    uid: user,
  },
});

// const io = io('window.location.pathname.split("/")[2]');
