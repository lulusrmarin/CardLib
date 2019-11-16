module.exports = {
    deck: {},

    // Hand Types with a numerical ranking
    handTypes: {
        straightFlush: 8,
        fourOfAKind: 7,
        fullHouse: 6,
        flush: 5,
        straight: 4,
        threeOfAKind: 3,
        twoPair: 2,
        pair: 1,
        highCard: 0
    },

    // Creates a deck and returns as an array of card objects.  Object contains a card name, numerical value, and suit
    makeDeck: function(){
        var deck = [];
        var position = 0;

        for(var suit = 0; suit < 4; suit++){
            switch(suit){
                case 0:
                    suitName = 'hearts';
                    break;
                case 1:
                    suitName = 'clubs';
                    break;
                case 2:
                    suitName = 'diamonds';
                    break;
                case 3:
                    suitName = 'spades';
            }

            for(var card = 0; card < 13; card++){
                switch(card){
                    case 0:
                        cardName = 'ace';
                        break;
                    case 10:
                        cardName = 'jack';
                        break;
                    case 11:
                        cardName = 'queen';
                        break;
                    case 12:
                        cardName = 'king';
                        break;
                    default:
                        cardName = card + 1;
                }

                deck[position] = {
                    card: cardName,
                    suit: suitName,
                    value: card + 1,
                };
                position++;
            }
        }

        return deck;
    },

    // Shuffle and return deck
    shuffleDeck: function(deck){
        var j, x, i;
        for (i = deck.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = deck[i];
            deck[i] = deck[j];
            deck[j] = x;
        }
        this.deck = deck;
        return deck;
    },

    // Todo:  Don't let this function run out of cards or throw an error if it does
    deal: function(deck, totalPlayers, totalCards = 2){
        var hands = [];
        for(currentPlayer = 0; currentPlayer < totalPlayers; currentPlayer++){
            hands[currentPlayer] = [];
            for(currentCard = 0; currentCard < totalCards; currentCard++){
                hands[currentPlayer].push(deck.pop());
            }
        }
        return hands;
    },

    dealCard: function(deck, amt = 1){
        var hand = [];
        for(var card = 0; card < amt; card++){
            hand.push(deck.pop());
        }
        
        return hand;
    },

    sortCardsHightToLow: function(cards){
        cards.sort(function(a, b){
            if(a.value == 1){
                return -1
            }
            return b.value - a.value;
        });
        
        return cards;
    },

    sortCardsBySuit(hand){
        var suits = {};

        hand.forEach(function(card){
            if(typeof(suits[card.suit]) === 'undefined'){
                suits[card.suit] = [];
            }
            
            suits[card.suit].push(card);
        });       
        
        return suits;
    },    

    // * * //
    // Begin Poker
    // * * //
    containsHighCard(hand){
        return this.sortCardsHightToLow(hand)[0];
    },

    containsPair(hand){
        var pairs = {};
        hand.forEach(function(card){
            pairs[card.card] = [];
        });

        hand.forEach(function(card){
            pairs[card.card].push(card);
        });
        
        pairs = Object.keys(pairs).map(function(pair){
            if(pairs[pair].length >= 2){
                return pairs[pair];
            }
        })
        
        pairs = pairs.filter(function(pair){
            return typeof(pair) !== 'undefined';
        });

        if(pairs.length > 0){
            return pairs;
        }
    },

    containsStraight: function(hand){
        hand = this.sortCardsHightToLow(hand);
        var highCard = 0;
        var straight = [];
        var lastCardValue = 0;
        straight.push(hand[0]);
        hand.forEach(function(card){
            lastCardValue = straight[straight.length - 1].value;

            // Handle high ace straight and typical card scenarios
            if( (card.value == lastCardValue - 1) || (lastCardValue == 1 && card.value == 13) ){
                straight.push(card);
            }

            // Handle low ace straight
            if(lastCardValue == 1 && card.value == 5){
                straight.push(card);
            }
            
        });

        if(straight.length >= 5){
            return straight;
        } else {
            return false;
        }
    },

    containsFlush: function(hand){
        flush = {};
        flush = this.sortCardsBySuit(hand);

        flush = Object.keys(flush).map(function(suit){
            if(flush[suit].length >= 5){
                return flush[suit];
            }
        })
        
        flush = flush.filter(function(suit){
            if(suit){
                return true;
            }
        })

        if(flush.length > 0){
            return flush
        }
    },

    containsStraightFlush: function(hand){
        var straightFlush = {};
        hand = this.sortCardsHightToLow(hand);
        suits = this.sortCardsBySuit(hand);

        Object.keys(suits).forEach((suit) => {
            if(typeof(straightFlush[suit]) === 'undefined'){
                straightFlush[suit] = [];
            }
            straightFlush[suit] = this.containsStraight(suits[suit]);
        })

        Object.keys(straightFlush).map(function(suit){
            if(straightFlush[suit].length >= 5){
                straightFlush[suit];
            } else {
                delete straightFlush[suit];
            }
        })

        Object.keys(straightFlush).forEach(function(suit){
            if(straightFlush[suit].length == 0){
                straightFlush[suit];
            }
        })

        if(Object.keys(straightFlush).length > 0){
            return straightFlush[Object.keys(straightFlush)[0]];
        }
    },

    containsRoyalFlush: function(hand){
        var hand = this.containsStraightFlush(hand);
        
        var royalFlush = hand.filter(function(suit){
            if(typeof(suit) !== 'undefined'){
                if(suit[0].value == 1 && suit[1].value == 13){
                    return true;
                }
            }
        });

        return royalFlush;
    },

    containsFourOfAKind: function(hand){
        var pairs = this.containsPair(hand);
        if(typeof(pairs) !== 'undefined'){
            var fourOfAKind = pairs.filter(function(pair){
                return pair.length == 4;
            })

            if(fourOfAKind.length > 0){
                return fourOfAKind;
            }
        }
    },

    containsThreeOfAKind: function(hand){
        var pairs = this.containsPair(hand);
            if(typeof(pairs) !== 'undefined'){
            var threeOfAKind = pairs.filter(function(pair){
                return pair.length == 3;
            })

            if(threeOfAKind.length > 1){
                return threeOfAKind;
            }
        }
    },

    // Checks for Mary Kate / Ashley Olsen and/or Bob Sagget
    containsFullHouse: function(hand){
        var pairs = this.containsPair(hand);
        var threeOfAKind = this.containsThreeOfAKind(hand);
        if(typeof(threeOfAKind) == 'undefined'){
            return undefined;
        }

        var fullHouse = [];
        fullHouse = fullHouse.concat(threeOfAKind[0]);

        pairs.forEach(function(pair){
            if(threeOfAKind[0][0].value !== pair[0].value){
                fullHouse = fullHouse.concat(pair);
            }
        })

        if(fullHouse.length >= 5){
            return fullHouse;
        }
    },

    containsTwoPair(hand){
        var pairs = this.containsPair(hand);
        if(typeof(pairs) !== 'undefined'){
            if(pairs.length >= 2){
                return pairs;
            }
        }
    },

    reportCardRatio: function(number){
        var loggedCards = {};
        for(let i = number; i > 0; i--) {
            var shuffledDeck = this.shuffleDeck(this.makeDeck());
            var topCard = this.dealCard(shuffledDeck)[0];
    
            if(typeof(loggedCards[topCard.suit]) === 'undefined'){
                loggedCards[topCard.suit] = {};
            }
    
            if(typeof(loggedCards[topCard.suit][topCard.card]) === 'undefined'){
                loggedCards[topCard.suit][topCard.card] = 0;
            }
    
            loggedCards[topCard.suit][topCard.card]++;
        }
    
        return loggedCards;
    },

    evaluatePokerHand: function(hand){
        console.log("Contains Royal Flush: ");
        console.log(this.containsRoyalFlush(hand));
        console.log("Potential Straights: ");
        console.log(this.containsStraight(hand));
        console.log("Potential Flush: ");
        console.log(this.containsFlush(hand));
        console.log("Contains Pairs: ");
        console.log(this.containsPair(hand));
        console.log("Contains High Card: ");
        console.log(this.containsHighCard(hand));
    },

    getBestHand: function(hand){
        if(this.containsStraightFlush(hand)){
            return {straightFlush: this.containsStraightFlush(hand)};
        }
        if(this.containsFourOfAKind(hand)){
            return {fourOfAKind: this.containsFourOfAKind(hand)};
        }
        if(this.containsFullHouse(hand)){
            return {fullHouse: this.containsFullHouse(hand)};
        }
        if(this.containsFlush(hand)){
            return {flush: this.containsFlush(hand)};
        }
        if(this.containsStraight(hand)){
            return {straight: this.containsStraight(hand)};
        }
        if(this.containsThreeOfAKind(hand)){
            return {threeOfAKind: this.containsThreeOfAKind(hand)};
        }
        if(this.containsTwoPair(hand)){
            return {twoPair: this.containsTwoPair(hand)};
        }
        if(this.containsPair(hand)){
            return {pair: this.containsPair(hand)};
        }
        if(this.containsHighCard(hand)){
            return {highCard: this.containsHighCard(hand)};
        }
    },

    breakTie: function(hand1, hand2, type){
        hand1 = this.sortCardsHightToLow(hand1);
        hand2 = this.sortCardsHightToLow(hand2);

        console.log("A tie for hand type " + type);

        switch(type){
            case this.handTypes.straightFlush:
                if(hand1[0].value == 1 && hand2[0].value == 1) {
                    if(hand1[1].value == hand2[1].value){
                        return 0;
                    }
                    else if(hand1[1].value == 13 && hand2[1].value == 5){
                        return -1;
                    }
                    else if(hand1[1].value == 5 && hand2[1].value == 13){
                        return 1;
                    }                    
                }
                else if(hand1[0].value == hand2[0].value){
                    return 0;
                }
                else {
                    return 1
                }
        }
    },

    // Sort multiple sets of hand into a winning hand
    getWinningHand: function(hands){
        var handRanks = []

        hands.forEach((hand) => {
            handRanks.push(this.getBestHand(hand));
        });

        // Order winning hands by card rank
        handRanks = handRanks.sort((a, b) => {
            // Get hand type rank orders
            let handRank = Object.keys(b)[0];
            let handType1 = this.handTypes[handRank];
            let handType2 = this.handTypes[handRank];
            
            if(handType1 == handType2){
                return this.breakTie(a[handRank], b[handRank], handType1);
            }
        })

        console.log(JSON.stringify(handRanks, null, 5));

        // hands.forEach((hand, player) => {
        //     console.log("Hand for player: " + player);
        //     console.log(hand);
        //     console.log("Hand Rank: ");
        //     //console.log(this.handTypes);
        //     console.log(this.handTypes[Object.keys(hand)[0]]);
        // });
    }
}