let SocketHandler = (io, game) => {

  let counter = 0;
  let bettingRound;
  io.on('connection', (socket) => {

    socket.on('CHECK', (data) => {
      io.emit('LOG',"HOST SAYS ALOHA")
      // sendUpdate()
    })
    socket.on('START_GAME', (data) => {
      io.emit('LOG',"HOST SAYS GAME NOW STARTED")
      // game.addPlayer(1)
      // game.makeHost(1)
      // game.startHand(1)
      // sendUpdate()
    })

  });

  function sendUpdate() {
    Object.keys(io.sockets.sockets).forEach(id => {
      let customState = {
        socketId: id,
        pot: game.hand.pot,
        spread: game.hand.spread,
        state: game.hand.state,
        order: game.hand.order,
        winner: game.hand.winner,
        dealer: game.hand.dealer,
        players: game.getAllPlayerPackages(),
        player_hand: game.getPlayerPackage()
      };
      io.sockets.sockets[id].emit("GAME_UPDATE", customState);
      io.sockets.sockets[id].emit("LOG", customState);
    })
  }
  function testServer(socket) {
    Object.keys(io.sockets.sockets).forEach(id => {
      requestChoice(socket, id)
    })
  }
  // function handleAction(bettingRound, data) {
  //   if (bettingRound.order[bettingRound.index % bettingRound.order.length]) {
  //     return bettingRound
  //   } else {
  //
  //   }
  //   switch (data.action) {
  //     case "BET":
  //       bettingRound.pot += data.amount
  //       bettingRound.origin = data.socketId
  //       break;
  //     case "CALL":
  //       bettingRound.index++
  //       break;
  //     case "FOLD":
  //       bettingRound.players[data.socketId].folded = true;
  //       break;
  //     default:
  //
  //   }
  // }

}

module.exports = SocketHandler;
