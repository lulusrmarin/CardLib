Vue.component('hand', {
    props: ['player'],
    data: function(){
        return {
            hand: {},
            pot: 0,
            chipsHeld: 0,
            chipsIn: 0,
            lastBet: 0,
            isDealer: false,
            isTurn: false,
        }
    },
    mounted: function(){
        axios.get('http://localhost:8080/?player=' + this.player)
        .then((response) => {
            console.log(response);
            this.hand = response.data.hand;
            this.chipsHeld = response.data.chips;
            this.isDealer = response.data.isDealer;
            this.isTurn = response.data.isTurn;
            this.chipsIn = response.data.in;
            this.lastBet = response.data.lastBet;
        })
    },
    methods: {
        test: function (amt){
            if (amt <= this.chipsHeld){
                this.chipsIn += amt;
                this.chipsHeld -= amt;
            }
        },
        update: function(info){
            this.chipsHeld = info.chips;
            this.chipsIn = info.in;
            this.isTurn = info.isTurn;
            this.$emit('update');
        }
    },
    template: `<div class="hand" :class="{turn: isTurn}">
            <div class="text-center">
                <span :class="{'font-weight-bold': isTurn}">Player {{player}}</span>
                <span v-if="isTurn">Your Turn</span>
            </div>
            <div class="row">
                <div v-for="card in hand" class="col-sm-1">
                    <img :src="'../images/cards/' + card.card + '_of_' + card.suit + '.png'" height="200px">    
                </div>
            </div>
            <div>Chips: {{chipsHeld}}</div>
            <div>
                In: {{chipsIn}}
                <chip-values :starting="chipsIn"></chip-values>
            </div>
            <div>Dealer: {{isDealer}}</div>
            <div>Turn: {{isTurn}}</div>
            <bet :available="chipsHeld" :lastBet="lastBet" :player="player" :chipsIn="chipsIn" v-if="this.isTurn" @increase="test" @update="update"></bet>
        </div>`
});