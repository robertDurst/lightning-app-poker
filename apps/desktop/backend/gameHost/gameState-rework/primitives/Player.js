
module.exports = class Player {
  constructor(id) {
    //Game Info
    this.id = id;
    this.balance = 100;
    this.socketId = '';
    this.displayName = '';
    this.gameStatus = undefined;
    this.isHost = undefined;
    //Hand Info
    this.hand = []
    this.isFolded = undefined;
    this.isDealer = undefined;
  }
}
