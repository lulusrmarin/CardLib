module.exports = {
    assignDealer: function(totalPlayers){
        return (Math.floor(Math.random() * totalPlayers) + 1) - 1
    }
}