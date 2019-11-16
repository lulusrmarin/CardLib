module.exports = {
    pot: 0,
    player: {},
    pending: {},

    distributeChips: function(totalPlayers, amount){
        for(currentPlayer = 0; currentPlayer < totalPlayers; currentPlayer++){
            this.player[currentPlayer] = {
                available: 0,
                in: 0
            };
            this.player[currentPlayer].available = amount;
            this.pending[currentPlayer] = 0;
        }
    },

    addToPot: function(player, amount){
        this.player[player].in += amount;
        this.player[player].available -= amount;
        this.pending[player] += amount;
        this.pot += amount;
    },
}