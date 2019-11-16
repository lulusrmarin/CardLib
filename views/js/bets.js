Vue.component('bet', {
    props: ['available', 'lastBet', 'player', 'chipsIn'],
    data: function(){
        return {
            showChips: false
        }
    },
    computed: {
        canCall: function(){
            return this.available > this.lastBet && this.lastBet > this.chipsIn;
        },
        canCheck: function(){
            return this.chipsIn == this.lastBet
        }
    },
    methods: {
        test: function(){
            console.log('test');
        },
        showchips: function(){
            this.showChips = true;
        },
        hideChips: function(){
            this.showChips = false;
        },
        raise: function(amt){
            this.$emit('increase', amt)
        },
        call: function(){
            axios.post('http://localhost:8080/?log=1', {
                call: true,
                player: this.player,
            })
            .then((response) => {
                console.log(response);
                this.$emit('update', response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
        },
        check: function(){
            axios.post('http://localhost:8080/?log=1', {
                check: true,
                player: this.player,
            })
            .then((response) => {
                console.log(response);
                this.$emit('update', response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
        },        
        fold: function(){
            
        }
    },
    template: `<form>
            <button type="button" class="btn btn-dark" @click="check()" v-if="canCheck">Check</button>
            <button type="button" class="btn btn-dark" @click="call()" v-if="canCall">Call</button>
            <button type="button" class="btn btn-dark" @click="showchips()">Raise</button>
            <button type="button" class="btn btn-dark" @click="fold()">Fold</button>

            <div v-if="showChips">
                <chips @increase="raise"></chips>
            </div>
        </form>`
});