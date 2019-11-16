Vue.component('chips', {
    methods: {
        bet: function(amount){
            //console.log(amount);
            this.$emit('increase', amount);
            axios.post('http://localhost:8080/', {
                bet: amount
            })
            .then((response) => {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });                    
        }
    },            
    template: `
        <div>
            <button type="button" class="btn btn-primary rounded-circle" @click="bet(1)">1</button>
            <button type="button" class="btn btn-success rounded-circle" @click="bet(5)">5</button>
            <button type="button" class="btn btn-danger rounded-circle" @click="bet(10)">10</button>
            <button type="button" class="btn btn-warning rounded-circle" @click="bet(25)">25</button>
        </div>
    `
});