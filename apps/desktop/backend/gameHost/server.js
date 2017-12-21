const http = require('http');
const socketIO = require('socket.io');
const SocketHandler = require('./utils/SocketHandler');
let Game = require('./gameState-rework/state');

let server;
let io;

function startServer() {
  server = http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Welcome to Poker!');
  }).listen(9090, "127.0.0.1");

   io = require('socket.io')(server, {
      serveClient: false,
      wsEngine: 'ws'
    });

    SocketHandler(io, Game);

    return Game;
}

function closeServer() {
  server.close( (data) => {
    console.log("CLOSED", data);
  });
}




module.exports = {
  startServer,
  closeServer
}
