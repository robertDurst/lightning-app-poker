const Round = require('../primitives/Round');
const output = require('./output');

//Start Round (betting round)
//Initialize the betting round with correct information
function startRound(cb) {
  this.round = new Round();
  this.round.origin = this.hand.order[0];
  this.round.active = this.hand.order[0];
  this.round.minAction = this.hand.order.length;
  this.round.callback = cb
  if (!this.bets) {
    this.bets = {}
  }
  this.bets[this.hand.state] = {};
  this.hand.order.forEach((id) => {
    this.bets[this.hand.state][id] = 0
  })
  return output(null)
}
//Advance State
//Move from table set to table set
function nextHandState() {
  if (this.hand.state === 0) {
    this.hand.spread = this.hand.deck.cards.slice(-3);
    this.hand.deck.cards = this.hand.deck.cards.slice(0, -3);
    this.hand.state++
    this.startRound()
  } else if (this.hand.state < 3) {
    this.hand.spread.push(...this.hand.deck.cards.slice(-1))
    this.hand.deck.cards = this.hand.deck.cards.slice(0, -1)
    this.hand.state++
    this.startRound()
  } else {
    this.resolveHand()
  }
  return output(null)
}
//Resolve Betting round
//Ends round, updates Hand, has callback
function resolveRound() {
  if (!this.roundEndCheck()) {
    return output('Round not over yet')
  }
  if (this.round.callback && this.hand.roundCallback) {
    this.hand.roundCallback()
  } else if (this.hand.roundCallback && !this.round.callback) {
    this.hand.roundCallback()
  } else if (!this.hand.roundCallback && this.round.callback) {
    this.round.callback()
  }
  this.hand.pot += this.round.pot;
  this.round.pot = 0
  this.round.isBetting = false;
  this.round.largestBet = undefined;
  const handOver = this.handEndCheck();
  if (handOver) {
    this.resolveHand()
  } 
  this.nextHandState()
}

function handEndCheck() {
  const playerCheck = this.hand.order < 2;
  const stateCheck = this.hand.state === 3;
  const roundCheck = this.round.isBetting;
  return playerCheck || (stateCheck && roundCheck)
}

module.exports = {
  nextHandState,
  startRound,
  resolveRound,
  handEndCheck
}
