/*
  Robert Durst, Lightning Spade, November 20, 2017
  A set of tests covering a full game state.
*/

const chai = require('chai');
const Game = require('../primitives/Game');


let assert = chai.assert;

let game
describe('Initial state', function() {
  before( function() {
    game = new Game("NAME","URL");
  });
  it('Should have correct URL', function() {
    assert.equal(game.hostURL, "URL");
  });

  it('Should have correct room name', function() {
    assert.equal(game.roomName, "NAME");
  });

  it('Should be inactive game to start', function() {
    assert.equal(game.isActive, false);
  });

})
describe('Player Basics', function() {
  before( function() {
    game = new Game("NAME","URL");
  })
  it('Should be able to add player', function() {
    game.addPlayer(12345)
    assert.equal(game.players[12345].id, 12345);
    assert.lengthOf(game.order, 1);
    game.addPlayer(123)
    assert.lengthOf(game.order, 2);
  });

  it('Should be able to change Host', function() {
    game.makeHost(12345)
    assert.equal(game.host, 12345);
    assert.equal(game.players[12345].isHost, true);
    game.addPlayer(54321)
    game.makeHost(54321)
    assert.equal(game.host, 54321);
    assert.equal(game.players[12345].isHost, false);
  });

  it('Should be able to remove player', function() {
    game.removePlayer(12345)
    assert.equal(!!game.players[12345], false);
    assert.lengthOf(game.order, 2);
  });
  it('Should maintain order of players', function() {
    assert.equal(game.order[0], 123);
  })
  it('Should be able to remove player that is host and end up with none', function() {
    game.removePlayer(54321)
    assert.equal(this.host, undefined);
  });
})

describe('Starting Game', function() {
  before( function() {
    game = new Game("NAME","URL");
    game.addPlayer(1)
    game.addPlayer(2)
    game.addPlayer(3)
    game.makeHost(1)
    game.startHand()
  })
  it('Creates a new dealer and sets all the dealer fields', function() {
    assert.equal(game.hand.dealer, 1)
    assert.equal(game.players[1].isDealer,true)
    assert.equal(game.players[2].isDealer,false)
  })
  // it('Puts 3 cards in spread', function() {
  //   assert.lengthOf(game.hand.spread,3)
  // })
  it('Each hand has 2 cards', function() {
    assert.lengthOf(game.players[1].hand,2)
    assert.lengthOf(game.players[2].hand,2)
    assert.lengthOf(game.players[3].hand,2)
  })
  it('Deck now has appropriate number of cards', function() {
    assert.lengthOf(game.hand.deck.cards, 46)
  })
  it('Game is active', function() {
    assert.equal(game.isActive,true)
  })
  it('Order of hand matches order of Game', function() {
    assert.isArray(game.order)
    assert.isArray(game.hand.order)
    for (var i = 0; i < game.order.length; i++) {
      assert.equal(game.order[i], game.hand.order[i])
    }
  })
})
describe('Advance basic states', function() {
  let value = 0
  before( function() {
    game = new Game("NAME","URL");
    game.addPlayer(1)
    game.addPlayer(2)
    game.addPlayer(3)
    game.makeHost(1)
    game.startHand()
  })
  it('State 0: 0 cards in spread', function() {
    assert.equal(game.hand.state, 0)
    assert.lengthOf(game.hand.spread, 0)
    assert.equal(value, 0)
  })
  it('State 1: 3 cards in spread', function() {
    game.nextHandState(() => {value++})
    assert.equal(game.hand.state, 1)
    assert.lengthOf(game.hand.spread, 3)
    assert.equal(value, 1)
  })
  it('State 2: 4 cards in spread', function() {
    game.nextHandState(() => {value++})
    assert.equal(game.hand.state,2)
    assert.lengthOf(game.hand.spread, 4)
    assert.equal(value, 2)
  })
  it('State 3: 5 cards in spread', function() {
    game.nextHandState(() => {value++})
    assert.equal(game.hand.state,3)
    assert.lengthOf(game.hand.spread, 5)
    assert.equal(value, 3)
  })
  it('State 3+: does not progress past this state', function() {
    game.nextHandState(() => {value++})
    assert.equal(game.hand.state,3)
    assert.lengthOf(game.hand.spread, 5)
    assert.equal(value, 4)
  })
})
describe('Betting Round Basics', function() {
  let game, game2, value = 0, players = [1,2,3], dummy;
  beforeEach(function() {
    game = new Game('thisName','thatURL')
    game.addPlayer(1)
    game.addPlayer(2)
    game.addPlayer(3)
    game.makeHost(1)
    game.startHand()
    game.startRound()
    value = 0
    game2 = new Game('thisName','thatURL')
    game2.addPlayer(1)
    game2.addPlayer(2)
    game2.addPlayer(3)
    game2.makeHost(1)
    game2.startHand()
  })
  it('Should be able to start a betting round with correct values initialized',function() {
    assert.equal(!!game.round,true)
    assert.equal(game.round.origin,1)
    assert.equal(game.round.active,1)
    assert.equal(game.round.largestBet,0)
    assert.equal(game.round.pot,0)
    assert.equal(game.round.actionCount,0)
    assert.equal(game.round.minAction,3)
  })
  it('Game.bets should have bets obj',function() {
    assert.isObject(game.bets, 'bets is object')
  })
  it('Each player in order bet value initialized to 0', function() {
    assert.isObject(game.bets[game.hand.state], 'bets.state is object')
    for (var i = 0; i < 3; i++) {
      assert.equal(game.hand.order[i],players[i], 'hand order')
    }
    Object.keys(game.bets[game.hand.state]).forEach((id) => {
      assert.equal(game.bets[game.hand.state][id], 0, 'all bets start at 0')
    })
  })
  it('Should have three functions',function() {
    assert.isFunction(game.bet, 'bet present')
    assert.isFunction(game.call, 'call present')
    assert.isFunction(game.fold, 'fold present')
  })
  it('Advance order works correctly', function() {
    assert.isFunction(game2.advanceOrder)
    assert.isArray(game2.hand.order)
    for (var i = 0; i < players.length; i++) {
      assert.equal(game2.hand.order[i],players[i])
    }
    game2.advanceOrder()
    for (var i = 0; i < players.length; i++) {
      assert.equal(game2.hand.order[i],[2,3,1][i])
    }
  })
  it('Round End Check should return false if round not over.', function() {
    assert.equal(game.roundEndCheck(),false)
  })
  it('Should allow betting and advance order', function() {
    assert.equal(game.round.active, 1)
    assert.equal(game.round.pot, 0)
    game.bet(1, () => {
      value++
    }, 5)
    assert.equal(game.round.active, 2, 'order change')
    assert.equal(game.round.pot, 5, 'pot increase ')
    assert.equal(game.round.actionCount,1, 'action increased counter')
    assert.equal(value, 1, 'callback ')
  })
  it('Should allow calling and advance order', function() {
    game.bet(1, () => {
      value++
    }, 5)
    assert.equal(game.round.pot, 5)
    game.call(2, () => {
      value++
    })
    assert.equal(game.round.active, 3, 'order change')
    assert.equal(game.round.pot, 10, 'pot increase')
    assert.equal(value, 2, 'callback')
  })
  it('Should allow folding and advance order', function() {
    game.bet(1, () => {
      value++
    }, 5)
    game.fold(2, () => {
      value++
    })
    assert.equal(game.round.active, 3, 'order change')
    assert.equal(game.round.pot, 5, 'pot stay same')
    assert.equal(value, 2, 'callback')
  })
  it('Order, pot and bets have all been modified by bet, call, fold actions', function() {
    game.fold(1,null)
    game.bet(2,null,5)
    game.bet(3,null,10)
    for (var i = 0; i < 2; i++) {
      assert.equal(game.hand.order[i],[2,3][i], 'correct order')
    }
    assert.equal(game.bets[0][1], 0, 'Correct bet')
    assert.equal(game.bets[0][2], 5, 'Correct bet')
    assert.equal(game.bets[0][3], 10, 'Correct bet')

  })
  it('Round can be ended', function() {
    game.fold(1,null)
    game.fold(2,null)
    assert.isFunction(game.resolveRound)
    game.resolveRound()
    assert.equal(game.round.isBetting,false)
  })
})
describe('Automatic Round Resolution' ,function() {
  let game, addValue=()=>{value++}, value, complete = false;
  beforeEach(function() {
    game = new Game('BOB','bob.com')
    game.addPlayer(1)
    game.addPlayer(2)
    game.addPlayer(3)
    game.makeHost(1)
    game.startHand()
    game.startRound(() => {
      complete = true
    })
    value = 0
  })
  it('Ends after all calls', function() {
    game.call(1)
    game.call(2)
    assert.equal(game.round.isBetting, true)
    game.call(3)
    assert.equal(game.round.isBetting, false)
  })
  it('Ends after bets and then only calls', function() {
    game.bet(1,null,3)
    game.bet(2,null,10)
    game.call(3)
    assert.equal(game.round.isBetting, true)
    game.call(1)
    assert.equal(game.round.isBetting, false)
  })
  it('Ends after fold and then only calls', function() {
    game.fold(1,null)
    game.bet(2,null,10)
    assert.equal(game.round.isBetting, true)
    game.call(3)
    assert.equal(game.round.isBetting, false)
  })
  it('Ends after folds down to a single player', function() {
    assert.equal(game.round.isBetting, true)
    game.fold(1,addValue)
    game.fold(2,addValue)
    assert.equal(game.round.isBetting, false)
  })
  it('Ends after folds after round of betting', function() {
    assert.equal(game.round.isBetting, true)
    game.bet(1,null,6)
    game.bet(2,null,7)
    game.bet(3,null,8)
    game.bet(1,null,10)
    game.fold(2,addValue)
    assert.equal(game.round.isBetting, true)
    game.fold(3,addValue)
    assert.equal(game.round.isBetting, false)
  })
  it('Can handle a bet call fold to end hand', function() {
    assert.equal(game.round.isBetting, true)
    game.bet(1,null,6)
    game.call(2,null)
    game.fold(3,null)
    assert.equal(game.round.isBetting, false)
  })
  it('Can handle a bet bet fold that doesn\'t end hand', function() {
    assert.equal(game.round.isBetting, true)
    game.bet(1,null,5)
    game.bet(2,null, 10)
    game.fold(3,null)
    game.bet(1,null,10)
    game.bet(2,null, 10)
    assert.equal(game.round.isBetting, true)
  })
  it('Calls the hand callback at the round ending ' , function() {
    game.fold(1,null)
    game.fold(2,null)
    assert.isTrue(complete)
  })
  it('Calls only the last action callback at the round ending ' , function() {
    game.fold(1,addValue)
    game.fold(2,addValue)
    game.fold(3,addValue)
    assert.isTrue(complete)
    assert.equal(value,2)
  })
})
describe('Betting Round Edge Cases', function() {
  let game, addValue=()=>{value++}, value;
  beforeEach(function() {
    game = new Game('BOB','bob.com')
    game.addPlayer(1)
    game.addPlayer(2)
    game.addPlayer(3)
    game.makeHost(1)
    game.startHand()
    game.startRound(() => {
    })
    value = 0
  })
  it('Wrong player calling does nothing', function() {
    for (id of [2,3]) {
      game.call(2,addValue)
    }
    assert.equal(value,0,'cb')
  })
  it('Wrong player betting does nothing', function() {
    for (id of [2,3]) {
      game.bet(2,addValue)
    }
    assert.equal(value,0,'cb')
    assert.equal(game.round.pot,0,'cb')
  })
  it('Wrong player folding does nothing', function() {
    for (id of [2,3]) {
      game.fold(2,addValue)
    }
    assert.equal(value,0,'cb')
  })
  it('Betting more than your balance does nothing', function() {
    const result = game.bet(1,addValue,200)
    assert.equal(value,0,'cb')
    assert.equal(result.success,false)
  })
  it('Betting not enough to actually raise does nothing', function() {
    const result1 = game.bet(1,addValue,15)
    const result2 = game.bet(2,addValue,10)
    assert.equal(value,1)
    assert.equal(result1.success, true)
    assert.equal(result2.success, false)
    assert.equal(game.bets[0][1], 15)
    assert.equal(game.bets[0][2], 0)
  })
  it('Betting to match instead of calling does not works', function() {
    const result1 = game.bet(1,addValue,15)
    const result2 = game.bet(2,addValue,15)
    assert.equal(value, 1, 'value')
    assert.equal(result2.success, false)
    assert.equal(game.bets[0][1], 15)
    assert.equal(game.bets[0][2], 0)
  })
  it('Calling while table bet is 0 does not bet', function() {
    const result1 = game.call(1,addValue)
    const result2 = game.call(2,addValue)
    assert.equal(value, 2, 'value')
    assert.equal(result2.success, true)
    assert.equal(game.bets[0][1], 0)
    assert.equal(game.bets[0][2], 0)
  })
  it('Calling while table bet is over you own bets (none -> value)', function() {
    const result1 = game.bet(1,addValue,20)
    const result2 = game.call(2,addValue)
    assert.equal(value, 2, 'value')
    assert.equal(result2.success, true)
    assert.equal(game.bets[0][1], 20)
    assert.equal(game.bets[0][2], 20)
    assert.equal(game.round.pot,40,'round pot')
    assert.equal(game.hand.pot,0,'hand pot')
  })
  it('Calling while table bet is over you own bets (value -> value)', function() {
    game.bet(1,addValue,5)
    game.call(2,addValue)
    game.bet(3,addValue,10)
    game.bet(1,addValue,10)
    game.call(2,addValue)
    game.call(3,addValue)
    assert.equal(value, 6, 'value')
    assert.equal(game.bets[0][2], 15)
    assert.equal(game.round.pot, 0, 'round pot')
    assert.equal(game.hand.pot, 45,'hand pot')
  })
  it('Calling while doing so would exceed your balance does nothing', function() {
    game.players[2].balance = 5
    game.bet(1,addValue,20)
    game.call(1,addValue)
    assert.equal(value,1,'value')
    assert.equal(game.bets[0][2], 0)
  })
  it('Folding as the last remaining player does nothing', function() {
    game.fold(1,addValue)
    game.fold(2,addValue)
    game.fold(3,addValue)
    assert.equal(value,2)
  })
})
describe('Scoring', function() {
  let game, addValue=()=>{value++}, value;
  beforeEach(function() {
    game = new Game('BOB','bob.com')
    game.addPlayer(4)
    game.addPlayer(5)
    game.addPlayer(6)
    game.makeHost(4)
    game.startHand()
    game.nextHandState()
    game.nextHandState()
    game.nextHandState()
    game.startRound()
    value = 0;
  })
  it('getWinnerIndex is function', function() {
    assert.isFunction(game.getWinnerIndex)
  })
  it('buildHands returns arrays for each player with 7 cards each', function() {
    assert.isFunction(game.buildHands)
    const hands = game.buildHands();
    const numHandsCheck = hands.length === 3;
    const numCardsCheck = hands.every( (hand) => {
      return hand.length === 7
    })
    assert.isTrue(numHandsCheck)
    assert.isTrue(numCardsCheck)
  });
  it('getWinner returns index array', function() {
    const winnerIndex = game.getWinnerIndex(game.buildHands())
    assert.isArray(winnerIndex);
  });
  it('getWinningID returns ID', function() {
    const winningID = game.getWinningID()
    assert.isArray(winningID);
  });
})
describe('Packages', function() {
  let game, addValue=()=>{value++}, value;
  beforeEach(function() {
    game = new Game('BOB','bob.com')
    game.addPlayer(4)
    game.addPlayer(5)
    game.addPlayer(6)
    game.makeHost(4)
    game.startHand()
    game.nextHandState()
    game.nextHandState()
    game.nextHandState()
    game.startRound()
    value = 0;
  })
  it('Can create batch of packages', function() {
    assert.isFunction(game.getAllPlayerPackages);
    const r1 = game.getAllPlayerPackages();
    assert.isArray(r1)
    assert.isObject(r1[0])
  })
  it('Can create single package', function() {
    assert.isFunction(game.getPlayerPackage);
    const r1 = game.getPlayerPackage(4);
    assert.isObject(r1)
  })
  it('Can create public package', function() {
    assert.isFunction(game.getPublicPackage);
    const r1 = game.getPublicPackage();
    assert.isObject(r1)
  })
})
