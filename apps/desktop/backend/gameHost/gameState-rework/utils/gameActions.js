const Player = require('../primitives/Player')
const Hand = require('../primitives/Hand');
const output = require('./output');
//Add Player
//Adds player to state object and order
function addPlayer(id, name, balance) {
  this.players[id] = new Player(id)
  this.players[id].displayName = name;
  this.players[id].balance = balance;
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
function startHand(cb1, cb2) {
  this.hand = new Hand();
  this.isActive = true;
  this.hand.handCallback = cb1;
  this.hand.roundCallback = cb2;
  this.bets = {};
  const dealerID = this.order[this.numGames % this.order.length];
  this.hand.dealer = dealerID;
  this.hand.order = this.order;
  this.order.forEach((id) => {
    this.players[id].hand = this.hand.deck.cards.splice(0, 2)
    this.players[id].isFolded = false;
    this.players[id].isDealer = id === dealerID;
  })
  this.startRound(cb2)
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
      // this.hand.pot = 0;
      break;
    case 2:
      winner1 = winningIDs[0];
      winner2 = winningIDs[1];
      this.players[winner1].balance += this.hand.pot / 2;
      this.players[winner2].balance += this.hand.pot / 2;
      // this.hand.pot = 0;
      break;
    case 3:
      winner1 = winningIDs[0];
      winner2 = winningIDs[1];
      winner3 = winningIDs[2];
      this.players[winner1].balance += this.hand.pot / 3;
      this.players[winner2].balance += this.hand.pot / 3;
      this.players[winner3].balance += this.hand.pot / 3;
      // this.hand.pot = 0;
      break;
    default:
      // TODO: If more than three winners
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
  this.hand.winner = winningIDs;
  this.hand.isPlaying = false;
  this.order = [...this.order.slice(1), ...this.order.slice(0,1)]
  if (this.hand.handCallback) {
    this.hand.handCallback()
  }
  this.order.forEach( (id) => {
    this.players[id].hand = []
  })
  this.hand.pot = 0
  this.hand.spread = []
}
//Creates array of objects to send to players
function getPublicPlayers() {
  const info = this.order.map( (id) => {
    return Object.assign({},{
      id: id,
      displayName: this.players[id].displayName,
      isFolded: this.players[id].isFolded,
      isDealer: this.players[id].isDealer,
      balance: this.players[id].balance,
    })
  })
  return info
}
//Create single player Info
function getPublicHand(id) {
  return this.players[id]
}
//Public Game Info
function getPublicGame() {
  const info = {
    roomName: this.roomName,
    host: this.host,
    hostURL: this.hostURL,
    isActive: this.isActive,
    order: this.order,
    bets: this.bets,
  }
  return info
}
//Public Hand Info
function getPublicHand() {
  const info = {
    isPlaying: this.hand.isPlaying,
    state: this.hand.state,
    dealer: this.hand.dealer,
    pot: this.hand.pot,
    winner: this.hand.winner,
    spread: this.hand.spread,
    order: this.hand.order,
  }
  return info
}
//Public Round Info
function getPublicRound() {
  const info = {
    isBetting: this.round.isBetting,
    origin: this.round.origin,
    largestBet: this.round.largestBet,
    active: this.round.active,
    pot: this.round.pot,
  }
  return info
}
module.exports = {
  addPlayer,
  removePlayer,
  makeHost,
  startHand,
  resolveHand,
  getPublicPlayers,
  getPublicRound,
  getPublicHand,
  getPublicGame,
}
