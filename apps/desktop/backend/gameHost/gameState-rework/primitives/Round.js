// const roundAction = require('../utils/roundActions');

module.exports = class Round {
  constructor() {
    //States
    this.isBetting = true
    //Highest Bet Info
    this.origin = undefined;
    this.largestBet = 0;
    //Next Player
    this.active = undefined;
    //Pot
    this.pot = 0;
    //Action Count -  for round to be complete must reach order length
    this.actionCount = 0;
    this.minAction = undefined;
    //Callback - for round end
    this.callback = undefined;
  }
}
