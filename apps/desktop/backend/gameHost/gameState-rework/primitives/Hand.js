const Deck = require('./Deck');
const handActions = require('../utils/handActions');

module.exports = class Hand {
  constructor() {
    //Hand Info
    this.isPlaying = true;
    this.state = 0;
    this.dealer = undefined;
    this.pot = 0;
    this.winner = undefined;
    //Alterable Order for turn order
    this.order = [];
    //Cards
    this.deck = new Deck();
    this.spread = [];
    //Callback fn
    this.callback = undefined
  }
}
