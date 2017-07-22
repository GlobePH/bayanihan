(function() {
  'use strict';

    var app  = new Vue({
        el: "#mainTable",
        data: {
            rows: [
            ]
        },
        beforeMount(){
            this.getVictims()
        },
        methods:{
            getVictims: function(row){
                this.$http.get('/sms')
                .then(function(response) {
                    this.rows = response.body;
                    console.log(response.body);
                }, function(response) {
                    console.log(response);
                });
            }
        }
    });

    // Vue.component('time-in-modal', {
    //     template: '#time-in-modal-template',
    //     data: function() {
    //         return {
    //             list: ''
    //         };
    //     },
    //     methods: {
    //         // close: function() {
    //         //     this.list = list;
    //         // },
    //         save: function() {
    //             this.$http.get('/sms')
    //             .then(function(response) {
    //                 this.list = response;
    //                 console.log(response);
    //             }, function(response) {
    //                 console.log(response);
    //             });
    //         }
    //     }
    // });

    // var mainTable = new Vue({
    //     el: '#mainTable',
    //     data: {
    //         showModal: false,
    //     },
    //     methods: {
    //         openModal: function(){
    //             return this.showModal = true;
    //         },
    //         closeCancel: function(){
    //             return this.showModal = false;
    //         }
    //     }
    // });
})();