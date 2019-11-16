Vue.component('card-table', {
    data: function(){
        return {
            pot: 0,
            pending: 0,
            lastBet: 0,
            phase: 0,
            cards: {}
        }
    },
    methods: {
        update :function(){
            this.$refs.log.update();
            axios.get('http://localhost:8080/?table=1')
            .then((response) => {
                console.log(response);
                this.pot = response.data.pot;
                this.pending = response.data.pending;
                this.lastBet = response.data.lastBet;
                if(response.data.phase){
                    this.phase = response.data.phase;
                }
                if(response.data.cards){
                    this.cards = response.data.cards;
                }
            })            
        }
    },
    mounted: function(){
        this.update();
    },
    template: `<div class="container-fluid">
        <div class="text-center">Table</div>
        <div class="row">
            <div class="h3 col text-center">Pot: {{pot}}<chip-values :starting="pot"></chip-values></div>
            <div class="h4 col text-center">Last Bet: {{lastBet}}</chip-values></div>
        </div>
        <div class="row">
            <div class="mr-4 col text-center" v-for="(value, idx) in pending">
                Player {{idx}}: {{value}} <chip-values :starting="value"></chip-values> 
            </div>
        </div>
        <div class="text-center">
            <div v-if="phase == 0">
                <span class="text-center">Preflop Phase {{phase}}</span>
                <img src="images/cards/9169ef73b3564976a7dc564d66861027.png" height="250px">
                <img src="images/cards/9169ef73b3564976a7dc564d66861027.png" height="250px">
                <img src="images/cards/9169ef73b3564976a7dc564d66861027.png" height="250px">
            </div>
            <div v-if="phase > 0">
                <span class="text-center" v-if="phase == 1">Flop Phase {{phase}}</span>
                <span class="text-center" v-if="phase == 2">Turn Phase {{phase}}</span>
                <span class="text-center" v-if="phase == 3">Riber Phase {{phase}}</span>
                <img v-for="card in cards" :src="'images/cards/' + card.card + '_of_' + card.suit + '.png'" height="250px">
            </div>            
        </div>
        <log ref="log"></log>
    </div>`
});