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
      const result = game.betPrecheck(data.id, data.amount);
      io.emit("LOG", {
        msg: "BET DATA",
        data,
        result
      })
      if (result === 1) {
        const memo = generateMemo(data.amount, data.id);
        lightning_socket.emit("BET", memo, data.amount)
        betInvoice(memo, (invoice) => {
          socket.emit('INVOICE', invoice, data.amount)
          completePayment(memo, () => {
            io.emit("LOG", "FINISHED BET PAYMENT")
            const r1 = game.bet(data.id, null, data.amount)
            socket.emit('LOG',r1)
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
      io.emit('LOG', {
        msg: "CALL",
        result,
        round: game.round
      })
      if (result === 1) {
        const amount = game.callAmount(data.id)
        if (amount !== 0) {
          const memo = generateMemo(amount, data.id);
          lightning_socket.emit("BET", memo, amount)
          io.emit('LOG', {
            msg: "CALL",
            amount,
            result,
            round: game.round
          })
          betInvoice(memo, (invoice) => {
            socket.emit('INVOICE', invoice, amount)
            completePayment(memo, () => {
              io.emit("LOG", "FINISHED CALL PAYMENT")
              game.call(data.id, null)
              sendUpdate()
            })
          })
        } else {
          game.call(data.id, null)
          sendUpdate()
        }
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


}

module.exports = SocketHandler;
