import {generateMemo, lightning_socket, betInvoice, completePayment} from './paymentProcess';

let SocketHandler = (io, Game) => {
  let game = undefined;
  let id2sid = {};
  let sid2id = {};
  io.on('connection', (socket) => {

    sendUpdate()
    // Check state
    socket.on('CHECK', (data) => {
      if (!game) {
        game = new Game();
        io.emit("LOG", "GAME INITIALIZED")
      }
      const payload = game
        ? generateCustomState(data.sid)
        : 'game undefined';
      io.emit('LOG', payload)
    })

    // Add oneself to Game state
    socket.on("READY_UP", (data) => {
      if (!game) {
        game = new Game();
        io.emit("LOG", "GAME INITIALIZED")
      }
      id2sid[data.id] = data.socketId;
      sid2id[data.socketId] = data.id;
      game.addPlayer(data.id, data.displayName, data.balance);
      io.emit('LOG', {
        msg: "DATA",
        val: data
      })
      io.emit('LOG', "Player added: " + data.displayName + " \n PUBKEY" + data.id)
    })
    socket.on('START_GAME', (data) => {
      game.startHand(() => {
        // TODO: CALLBACK FOR END OF hand
        io.emit('LOG', "Hand is over")
      }, () => {
        // TODO: CALLBACK FOR END OF ROUND 1
        io.emit('LOG', "Round over: "+game.hand.state)
      })
      io.emit('LOG', "Hand started")
      sendUpdate()
    })


    // BET
    socket.on('BET', (data) => {
      // io.emit("LOG", "ID\n" + data.id)
      io.emit("LOG", {
        msg: "DATA",
        data,
      })

      const result = game.betPrecheck(data.id, data.amount);

      if (result === 1) {
        const memo = generateMemo(data.amount, data.id);
        lightning_socket.emit("BET", memo, data.amount)
        io.emit('LOG', {
          msg: "MEMO",
          memo
        })
        betInvoice(memo, (invoice) => {
          socket.emit('INVOICE', invoice, data.amount)
          completePayment(memo, () => {
            io.emit("LOG", "FINISHED PAYMENT")
            game.bet(data.id, () => {
            }, data.amount)
            sendUpdate()
          })
        })
      } else {
        socket.emit('LOG', {
          result,
          msg: 'failed bet',
          round: game.round,
        })
      }

    })

    // CALL
    socket.on('CALL', (data) => {
      const result = game.callCheck(data.id);
      if (result) {
        const amount = game.callAmount(data.id)
        const memo = generateMemo(amount, data.id);
        lightning_socket.emit("BET", memo, amount)
        io.emit('LOG', {
          msg: "MEMO",
          memo
        })
        betInvoice(memo, (invoice) => {
          socket.emit('INVOICE', invoice, amount)
          completePayment(memo, () => {
            io.emit("LOG", "FINISHED PAYMENT")
            game.call(data.id, () => {
            }, amount)
            sendUpdate()
          })
        })
      }
    })

    // FOLD
    socket.on('FOLD', (data) => {
      const result = game.fold(data.id);
      io.emit('LOG', result)
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
    const id = sid2id[sid];
    return game ? {
      player: game.players[id]
        ? game.players[id]
        : "undefined",
      game: game.getPublicGame(),
      hand: game.getPublicHand(),
      round: game.getPublicRound(),
      players: game.getPublicPlayers(),
      full_game: game
    } : sid
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
