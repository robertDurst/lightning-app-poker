let SocketHandler = (io, Game) => {
  let game = undefined;
  let idHash = {};
  let socketIdHash = {};
  io.on('connection', (socket) => {
    if (!game) {
      game = new Game();
      io.emit("LOG", "GAME INITIALIZED")
    }

    socket.on('CHECK', (data) => {
      const payload = game
        ? generateCustomState(data.sid)
        : 'game undefined';
      io.emit('LOG', payload)
    })
    socket.on("READY_UP", (data) => {
      if (!data) {
        data = {
          id: 1,
          displayName: "Player1",
          socketId: undefined
        }
      }
      idHash[data.id] = data.socketId;
      socketIdHash[data.socketIdid] = data.id;
      game.addPlayer(data.id, data.displayName);
      io.emit('LOG', "Player added: " + data.displayName + " \n PUBKEY" + data.pubkey)
    })
    socket.on('START_GAME', (data) => {
      game.startHand(() => {
        // TODO: CALLBACK FOR END OF hand
        io.emit('LOG', "Hand is over")
      }, () => {
        // TODO: CALLBACK FOR END OF ROUND 1
        io.emit('LOG', "Round 1 is over")
      })
      io.emit('LOG', "Hand started")
      sendUpdate()
    })

    socket.on('CALL', (data) => {
      const result = game.call(data.id);
      if (result.success) {
        io.emit('LOG', "CALL MADE")
        sendUpdate()
      }
    })
    socket.on('BET', (data) => {
      const result = game.call(data.id, data.amount);
      if (result.success) {
        io.emit('LOG', "BET MADE")
        sendUpdate()
      }
    })
    socket.on('FOLD', (data) => {
      const result = game.call(data.id);
      if (result.success) {
        io.emit('LOG', "FOLD MADE")
        sendUpdate()
      }
    })

  });

  function sendUpdate() {
    Object.keys(io.sockets.sockets).forEach(sid => {
      const customState = generateCustomState(sid)
      io.sockets.sockets[sid].emit("GAME_UPDATE", customState);
    })
  }
  function generateCustomState(sid) {
    return {
      player: game.players[socketIdHash[sid]],
      game: game.getPublicGame(),
      hand: game.getPublicHand(),
      round: game.getPublicRound(),
      players: game.getPublicPlayers(),
      full_game: game
    }
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
