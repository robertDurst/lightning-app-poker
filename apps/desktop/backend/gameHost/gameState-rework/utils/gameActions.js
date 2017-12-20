const Player = require('../primitives/Player')
const Hand = require('../primitives/Hand');
const output = require('./output');
//Add Player
//Adds player to state object and order
function addPlayer(id) {
  this.players[id] = new Player(id)
  this.order.push(id);
  return output(null)
}
//MakeHost
//Change current host to be ID
function makeHost(id) {
  if (this.host) {
    const oldHostID = this.host;
    this.players[oldHostID].isHost = false;
  }
  this.host = id;
  this.players[id].isHost = true;
  return output(null)
}
//Remove Player
//Remove Player from state and order
function removePlayer(id) {
  delete this.players[id]
  this.order.splice(this.order.indexOf(id), 1);
  if (this.hand) {
    this.order.splice(this.hand.order.indexOf(id), 1);
  }
  if (this.host === id) {
    this.host = undefined;
  }
  return output(null)
}
//Start Hand
//Starts new Hand with all present Players
//Deals cards to players
function startHand(cb) {
  this.hand = new Hand();
  this.isActive = true;
  this.hand.callback = cb
  this.bets = {};
  const dealerID = this.order[this.numGames % this.order.length];
  this.hand.dealer = dealerID;
  this.hand.order = this.order;
  this.order.forEach((id) => {
    this.players[id].hand = this.hand.deck.cards.splice(0, 2)
    this.players[id].isFolded = false;
    this.players[id].isDealer = id === dealerID;
  })
  return output(null)
}

//Resolve Hand
//End Hand and distributes pot to winner of game
function resolveHand() {
  const winningIDs = this.getWinningID()
  let winner1, winner2, winner3;
  const potSize = this.hand.pot;
  switch (winningIDs.length) {
    case 1:
      winner1 = winningIDs[0];
      this.players[winner1].balance += this.hand.pot;
      this.hand.pot = 0;
      break;
    case 2:
      winner1 = winningIDs[0];
      winner2 = winningIDs[1];
      this.players[winner1].balance += this.hand.pot / 2;
      this.players[winner2].balance += this.hand.pot / 2;
      this.hand.pot = 0;
      break;
    case 3:
      winner1 = winningIDs[0];
      winner2 = winningIDs[1];
      winner3 = winningIDs[2];
      this.players[winner1].balance += this.hand.pot / 3;
      this.players[winner2].balance += this.hand.pot / 3;
      this.players[winner3].balance += this.hand.pot / 3;
      this.hand.pot = 0;
      break;
    default:
      // TODO: If more than three winners
  }
  if (this.hand.callback) {
    this.hand.callback()
  }
  const gameToStore = {
    ts: new Date(),
    winner: winningIDs,
    potSize,
    bets: this.bets,
    spread: this.hand.spread,
    dealer: this.hand.dealer
  }
  this.history.push(gameToStore)
  this.bets = undefined;
  this.hand.winner = winningIDs;
  this.hand.isPlaying = false;
  this.order.map( (id) => {
    this.players[id].hand = []
  })
  this.order = [...this.order.slice(1), ...this.order.slice(0,1)]
}
//Creates array of objects to send to players
function getAllPlayerInfo() {
  const info = this.order.map( (id) => {
    return Object.assign({},{
      id: id,
      name: this.players[id].displayName,
      isFolded: this.players[id].isFolded,
    })
  })
  return info
}
//Create single player Info
function getPlayerInfo(id) {
  return this.players[id]
}
//Public Info
function getPublicInfo() {
  const info = {
    spread: this.hand.spread,
    pot: this.hand.pot + this.round.pot,
    state: this.state,
    order: this.order,
    largestBet: this.round.largestBet,
    origin: this.round.origin,
  }
  return info
}
module.exports = {
  addPlayer,
  removePlayer,
  makeHost,
  startHand,
  resolveHand,
  getAllPlayerInfo,
  getPlayerInfo,
  getPublicInfo,
}
