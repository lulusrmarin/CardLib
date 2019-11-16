var cards = require('../cards');
var shuffledDeck = cards.shuffleDeck(cards.makeDeck());

var straightFlushHigh = [ { card: 'ace', suit: 'diamonds', value: 1 },
{ card: 'king', suit: 'diamonds', value: 13 },
{ card: 'jack', suit: 'diamonds', value: 11 },
{ card: 'queen', suit: 'diamonds', value: 12 },
{ card: 10, suit: 'diamonds', value: 10 } ];

var straightFlushLow = [ { card: 'ace', suit: 'spades', value: 1 },
{ card: 2, suit: 'spades', value: 2 },
{ card: 3, suit: 'spades', value: 3 },
{ card: 4, suit: 'spades', value: 4 },
{ card: 5, suit: 'spades', value: 5 } ];

var straightNotFlush = [ { card: 'ace', suit: 'diamonds', value: 1 },
{ card: 2, suit: 'diamonds', value: 2 },
{ card: 3, suit: 'spades', value: 3 },
{ card: 4, suit: 'diamonds', value: 4 },
{ card: 5, suit: 'diamonds', value: 5 } ];

var flushNotStraight = [ { card: 'ace', suit: 'diamonds', value: 1 },
{ card: 2, suit: 'diamonds', value: 2 },
{ card: 6, suit: 'diamonds', value: 6 },
{ card: 4, suit: 'diamonds', value: 4 },
{ card: 5, suit: 'diamonds', value: 5 } ];

var fourKings = [ { card: 'king', suit: 'diamonds', value: 1 },
{ card: 'king', suit: 'spades', value: 13 },
{ card: 'king', suit: 'clubs', value: 11 },
{ card: 'king', suit: 'hearts', value: 12 },
{ card: 10, suit: 'diamonds', value: 10 } ];

var fourAces = [ { card: 'ace', suit: 'diamonds', value: 1 },
{ card: 'ace', suit: 'spades', value: 13 },
{ card: 'ace', suit: 'clubs', value: 11 },
{ card: 'ace', suit: 'hearts', value: 12 },
{ card: 10, suit: 'diamonds', value: 10 } ];    

var threeOfAKind = [ { card: 'ace', suit: 'diamonds', value: 1 },
{ card: 'ace', suit: 'spades', value: 1 },
{ card: 'ace', suit: 'clubs', value: 1 },
{ card: 2, suit: 'hearts', value: 2 },
{ card: 10, suit: 'diamonds', value: 10 } ];

var fullHouse = [ { card: 'ace', suit: 'diamonds', value: 1 },
{ card: 'ace', suit: 'spades', value: 1 },
{ card: 'ace', suit: 'clubs', value: 1 },
{ card: 2, suit: 'hearts', value: 2 },
{ card: 2, suit: 'diamonds', value: 2 } ];

var twoPair = [ { card: 'ace', suit: 'diamonds', value: 1 },
{ card: 'ace', suit: 'spades', value: 1},
{ card: 5, suit: 'clubs', value: 5 },
{ card: 5, suit: 'hearts', value: 5 },
{ card: 'Jack', suit: 'diamonds', value: 11 } ];

var pair = [ { card: 'ace', suit: 'diamonds', value: 1 },
{ card: 'ace', suit: 'spades', value: 1},
{ card: 5, suit: 'clubs', value: 5 },
{ card: 2, suit: 'hearts', value: 2 },
{ card: 'Jack', suit: 'diamonds', value: 11 } ];

var royalSampler = [ { card: 'ace', suit: 'diamonds', value: 1 },
{ card: 7, suit: 'spades', value: 7},
{ card: 5, suit: 'clubs', value: 5 },
{ card: 2, suit: 'hearts', value: 2 },
{ card: 'Jack', suit: 'diamonds', value: 11 } ];

function testStraightFlush(){
    console.log("Straight Flush Test: ");
    console.log("High Straight Flush: ");
    console.log( cards.containsStraightFlush(straightFlushHigh) );

    console.log("Low Straight Flush: ");
    console.log( cards.containsStraightFlush(straightFlushLow) );

    console.log("Straight Not Flush: ");
    console.log( cards.containsStraightFlush(straightNotFlush) );

    console.log("Flush Not Straight ");
    console.log( cards.containsStraightFlush(straightNotFlush) );        
}

function testFourOfAKind(){
    console.log("\nFour of A Kind Test: ");
    console.log("Four Kings: ");
    console.log(cards.containsFourOfAKind(fourKings));

    console.log("Four Aces: ");
    console.log(cards.containsFourOfAKind(fourAces));

    console.log("Three Of A Kind: ");
    console.log(cards.containsFourOfAKind(threeOfAKind));

    console.log("Full House: ");
    console.log(cards.containsFourOfAKind(fullHouse));
}

function testThreeOfAKind(){
    console.log("\nThree of A Kind Test: ");
    console.log("Three Of A Kind: ");
    console.log(cards.containsThreeOfAKind(threeOfAKind));

    console.log("Pair: ");
    console.log(cards.containsFullHouse(pair));     

    console.log("Junk: ");
    console.log(cards.containsThreeOfAKind(royalSampler));
}

function testFullHouse(){
    console.log("\nFull House Test: ");
    console.log("Full House: ");
    console.log(cards.containsFullHouse(fullHouse));

    console.log("Three Of A Kind: ");
    console.log(cards.containsFullHouse(threeOfAKind));

    console.log("Pair: ");
    console.log(cards.containsFullHouse(pair));    
}

function testFlush(){
    console.log("\nFlush Test: ");
    console.log("High Straight Flush: ");
    console.log( cards.containsFlush(straightFlushHigh) );

    console.log("Flush Not Straight ");
    console.log( cards.containsStraightFlush(flushNotStraight) );       

    console.log("Pair: ");
    console.log(cards.containsFullHouse(pair));        
}

function testStraight(){
    console.log("\nStraight Test: ");
    console.log( cards.containsStraight(straightFlushHigh) );    

    console.log("Flush Not Straight ");
    console.log( cards.containsStraight(flushNotStraight) );        
}

function testTwoPair(){
    console.log("\nTwo Pair Test: ");
    console.log("Full House: ");
    console.log(cards.containsTwoPair(fullHouse));

    console.log("Two Pair: ");
    console.log(cards.containsTwoPair(twoPair));

    console.log("Pair: ");
    console.log(cards.containsTwoPair(pair));
}

function testHighCard(){
    console.log("\nHigh Card Test: ");
    console.log("High Straight Flush: ");
    console.log( cards.containsHighCard(straightFlushHigh) );    

    console.log("Junk: ");
    console.log(cards.containsHighCard(royalSampler));
}

function testWinningHand(){
    let bestHands = [straightFlushHigh, straightFlushLow];
    cards.getWinningHand(bestHands);
}

function testBreakTie(){
    console.log("Testing Tie Break Straight Flush High vs Low");
    console.log(cards.breakTie(straightFlushHigh, straightFlushLow, cards.handTypes.straightFlush));
    console.log("Testing Tie Break Straight Flush High vs High");
    console.log(cards.breakTie(straightFlushHigh, straightFlushHigh, cards.handTypes.straightFlush));
    console.log("Testing Tie Break Straight Flush Low vs High");
    console.log(cards.breakTie(straightFlushLow, straightFlushHigh, cards.handTypes.straightFlush));    
}

testWinningHand();

// testStraightFlush();
// testFourOfAKind();
// testFullHouse();
// testFlush();
// testStraight();
// testThreeOfAKind();
// testTwoPair();
// testHighCard();



// Let's test the odds for how much a given hand wins
// let hands = [];
// let bestHands = [];
// var river = cards.dealCard(shuffledDeck, 5);
// for(let player = 0; player < 8; player++){
//     hands[player] = cards.dealCard(shuffledDeck, 2);
//     hands[player] = hands[player].concat(river);
//     bestHands[player] = cards.getBestHand(hands[player]);
// }

// //console.log(cards.reportCardRatio(100000));

// console.log("Hands Are: ");
// console.log(hands);
// console.log(bestHands);
// console.log("Winning Hand is: ");
// cards.getWinningHand(bestHands);
