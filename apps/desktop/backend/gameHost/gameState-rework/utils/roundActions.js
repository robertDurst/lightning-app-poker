const output = require('./output');

//Advance order
//Change HAND order by rotating game.hand.order.
//Returns new next player
function advanceOrder() {
  const activePlayerID = this.hand.order[0];
  this.hand.order = [
    ...this.hand.order.slice(1),
    activePlayerID
  ]
  return this.hand.order[0]
}
// Bet Precheck
function betPrecheck(id, amount) {
  //Active Check
  if (this.round.active !== id) {
    return -3
  }
  //Betting Round Running Check
  if (!this.round.isBetting) {
    return -2
  }
  //Make sure new bet does not reduce player balance to zero or negative
  if (this.players[id].balance - amount <= 0) {
    return -1
  }
  //Make sure new bet surpasses current largest bet
  const playerBet = amount + this.bets[this.hand.state][id];
  if (playerBet <= this.round.largestBet) {
    return playerBet
  }
  return 1
}
//Bet
//If player active make bet for player and change round state
//Callback function on new ID
function bet(id, cb, amount) {
  //Active Check
  if (this.round.active !== id) {
    return output('Not active player')
  }
  //Betting Round Running Check
  if (!this.round.isBetting) {
    return output('Round over')
  }
  //Make sure new bet does not reduce player balance to zero or negative
  if (this.players[id].balance - amount <= 0) {
    return output('Insufficient funds')
  }
  //Make sure new bet surpasses current largest bet
  const playerBet = amount + this.bets[this.hand.state][id];
  if (playerBet <= this.round.largestBet) {
    return output('Does not exceed current largest bet. \nPlayer Bet:'+playerBet+'\nlargestbet: '+this.round.largestBet)
  }
  // TODO: LND
  //Raise Player's hand bet
  this.bets[this.hand.state][id] = playerBet
  //Raise Round's largest bet
  this.largestBet = playerBet;
  //Raise Round pot value
  this.round.pot += amount;
  //Change the terminating player id for the Round
  this.round.origin = id;
  //Order change
  this.round.actionCount++;
  const newActive = this.advanceOrder();
  this.round.active = newActive;
  if (cb) {
    cb(newActive)
  }
  const roundOver = this.roundEndCheck()
  if (roundOver) {
    this.resolveRound()
  }
  return output(null)

}
// Call check
function callCheck(id) {
  if (this.round.active !== id) {
    return -2
  }
  //Betting Round Running Check
  if (!this.round.isBetting) {
    return -1
  }
  const playerBet = this.bets[this.hand.state][id];
  const callAmount = this.largestBet - playerBet;
  if (playerBet <= this.round.largestBet) {
    return 1
  }
  return 0
}

// Call AMount
function callAmount(id) {
  const playerBet = this.bets[this.hand.state][id];
  const callAmount = this.round.largestBet - playerBet;
  return callAmount
}
//Call
//If player active call for player and change round state
//Callback on new ID
function call(id, cb) {
  //Active Check
  if (this.round.active !== id) {
    return output('Not active player')
  }
  //Betting Round Running Check
  if (!this.round.isBetting) {
    return output('Round over')
  }
  //Raise playerbet if necessary
  const playerBet = this.bets[this.hand.state][id];
  const callAmount = this.round.slargestBet - playerBet;
  //If passive bet made by call
  if (playerBet < this.round.largestBet) {
    this.bets[this.hand.state][id] = this.largestBet
    this.round.pot += callAmount;
  }
  //Order change
  this.round.actionCount++
  const newActive = this.advanceOrder();
  this.round.active = newActive;
  if (cb) {
    cb(newActive)
  }
  const roundOver = this.roundEndCheck()
  if (roundOver) {
    this.resolveRound()
  }
  return output(null)
}
//Fold
//If player active fold for player and change round state
//callback on new ID
function fold(id, cb) {
  //Check if player is active player
  if (this.round.active !== id) {
    return output('Not active player')
  }
  //Betting Round Running Check
  if (!this.round.isBetting) {
    return output('Round over')
  }
  //Cut size of order down by one
  this.hand.order = this.hand.order.slice(1);
  //Change player information
  this.players[id].isFolded = true;
  //Order change
  this.round.actionCount++
  const newActive = this.hand.order[0]
  this.round.active = newActive;
  if (cb) {
    cb(newActive)
  }
  const roundOver = this.roundEndCheck();
  if (roundOver) {
    this.resolveRound()
  }
  return output(null)

}
//Check if Round Over
//To be called after every successful play to check if round is over
//Returns true if round is over
function roundEndCheck() {
  const foldEndCheck = this.hand.order.length < 2;
  const actionCountCheck = this.round.minAction <= this.round.actionCount;
  const playerCheck = this.round.active === this.round.origin;
  const betMap = this.hand.order.map((id) => {
    return this.bets[this.hand.state][id]
  })
  let bet1 = betMap[0];
  let betCheck = betMap.every( (bet) => {
    return bet === bet1
  })
  return  foldEndCheck || playerCheck && betCheck && actionCountCheck
}

module.exports = {
  betPrecheck,
  bet,
  callCheck,
  callAmount,
  call,
  fold,
  advanceOrder,
  roundEndCheck,
}
