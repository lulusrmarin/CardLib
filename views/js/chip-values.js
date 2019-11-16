Vue.component('chip-values', {
    props: ['starting'],
    data: function(){
        return {
            inChips: 0,
        }
    },
    computed: {
        chipValues: function(){
            if(this.starting != this.inChips){
                this.inChips = this.starting;
            }

            var chipValues = [];
            var chipTypes = [25,10,5,1];
            var totalChips = this.inChips;
            chipTypes.forEach( function(value){
                while(totalChips >= value){
                    totalChips -= value;
                    chipValues.push(value);
                }
            });

            return chipValues;
        }
    },
    template: `
        <div>{{chipValues}}</div>
    `
});