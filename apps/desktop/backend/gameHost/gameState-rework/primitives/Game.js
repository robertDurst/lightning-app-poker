const gameAction = require('../utils/gameActions');
const handAction = require('../utils/handActions');
const roundAction = require('../utils/roundActions');
const scoringAction = require('../utils/DetermineWinner')

module.exports = class Game {
  constructor(roomName, url) {
    //Game Info
    this.roomName = roomName;
    this.host = undefined;
    this.hostURL = url;
    this.history = [];
    this.numGames = 0;
    this.isActive = false;
    //States
    this.hand = undefined;
    this.round = undefined;
    this.bets = undefined;
    //Player Info
    this.players = {};
    this.order = [];

    //Functions
    //Game Maintenance
    this.addPlayer = gameAction.addPlayer;
    this.removePlayer = gameAction.removePlayer;
    this.makeHost = gameAction.makeHost;
    this.startHand = gameAction.startHand;
    this.resolveHand = gameAction.resolveHand;
    //Hand Maintenance
    this.nextHandState = handAction.nextHandState;
    this.startRound = handAction.startRound;
    this.resolveRound = handAction.resolveRound;
    //Round Maintenance
    this.betPrecheck = roundAction.betPrecheck;
    this.bet = roundAction.bet;
    this.callCheck = roundAction.callCheck;
    this.callAmount = roundAction.callAmount;
    this.call = roundAction.call;
    this.fold = roundAction.fold;
    this.advanceOrder = roundAction.advanceOrder;
    this.roundEndCheck = roundAction.roundEndCheck;
    //Scoring
    this.getWinnerIndex = scoringAction.getWinnerIndex;
    this.buildHands = scoringAction.buildHands;
    this.getWinningID = scoringAction.getWinningID;
    //Packages
    this.getPublicGame = gameAction.getPublicGame;
    this.getPublicHand = gameAction.getPublicHand;
    this.getPublicRound = gameAction.getPublicRound;
    this.getPublicPlayers = gameAction.getPublicPlayers;
  }
}
