var express = require("express");
var cards = require('./cards');
var player = require('./players');
var bets = require('./bets');
var holdem = require('./holdem')
var log = require('./log')

var app = express();

// Some initial game conditions
const players = 2;
const bigBlindAmt = 10;
const smallBlindAmt = 5;
var deck = cards.makeDeck();
var deck = cards.shuffleDeck(deck);
var hands = cards.deal(deck, players, 2);
var dealer = player.assignDealer(players);
var bigBlind = dealer;
var turn = dealer + 1 >= players ? 0 : dealer + 1;
var smallBlind = dealer -1 >= 0 ? dealer - 1 : players - 1;
var lastBet = bigBlindAmt;
var phase = 0;
var tableCards = {};

bets.distributeChips(players, 500);
bets.addToPot(dealer, bigBlindAmt);
bets.addToPot(smallBlind, smallBlindAmt);

//Log stuff
log.enter("Big Blind of " + bigBlindAmt + " paid by player " + dealer);
log.enter("Small blind of " + smallBlindAmt + " paid by player " + turn);
log.enter("Current turn, player " + turn);
log.enter("Call, Raise or Fold?");

console.log(hands);
console.log(bets.player);
console.log(bets.pot);

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

app.post("/", function (request, response){
    console.log(request.params);
    console.log(request.body);
    console.log(request.query);

    if(request.body.bet){
        bets.addToPot(request.body.player, request.body.bet);
    }

    if(request.body.call){
        var player = request.body.player - 1;
        var betAmt = lastBet - bets.player[request.body.player - 1].in;
        turn = turn + 1 >= players ? 0 : turn + 1;

        bets.addToPot(player, betAmt);
        log.enter("Player" + player + " calls " + betAmt);
        log.enter("Turn is now Player " + turn);

        response.send({
            chips: bets.player[player].available,
            in: bets.player[player].in,
            isTurn: player == turn
        });
    }

    if(request.body.check){
        var player = request.body.player - 1;
        turn = turn + 1 >= players ? 0 : turn + 1;

        log.enter("Player" + player + " checks ");
        log.enter("Turn is now Player " + turn);

        if(player == dealer){
            phase++;
            log.enter("One full cycle completed");
            switch(phase){
                case 1:
                    tableCards = cards.dealCard(deck, 3);
                    break;
                case 2:
                case 3:
                    tableCards = tableCards.concat(cards.dealCard(deck));
                case 4:
                    hands.forEach(function(hand){
                        cards.evaluatePokerHand(hand, tableCards);
                    })
            }
        }

        response.send({
            chips: bets.player[player].available,
            in: bets.player[player].in,
            isTurn: player == turn
        });
    }    
});

app.get("/", function (request, response){
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    response.setHeader('Access-Control-Allow-Credentials', true);

    console.log(request.params);
    console.log(request.body);
    console.log(request.query);

    if(request.query.player){
        player = parseInt(request.query.player) - 1;
        response.send({
            hand: hands[player],
            chips: bets.player[player].available,
            in: bets.player[player].in,
            isDealer: player == dealer,
            isTurn: player == turn,
            lastBet: lastBet
        });
    } 
    
    else if(request.query.table){
        response.send({
            pot: bets.pot,
            pending: bets.pending,
            lastBet: lastBet,
            bigBlind: bigBlind,
            smallBlind: smallBlind,
            cards: tableCards,
            phase: phase,
        });
    }

    else if(request.query.log){
        response.send(log.log);
    }    
    
    else {
        response.sendFile(__dirname+"/views/index.html");
    }
});

app.use(express.static('public'));
app.use(express.static('views'));

//start the server
console.log("Card server listening on port 8080, localhost")
app.listen(8080);