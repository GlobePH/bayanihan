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
      getMapURL: function(message) {
        var coords = message.split(' ');
        var latitude = Number(coords[0]);
        var longtitude = Number(coords[1]);
        return 'https://www.google.com/maps/preview/@' + latitude + ',' + longtitude + ',20z';
      },
      isCoordinates: function(message) {
        var coords = message.split(' ');
        if(coords.length !== 2) { return false; }
        var latitude = Number(coords[0]);
        var longtitude = Number(coords[1]);
        return !isNaN(latitude) && !isNaN(longtitude);
      }
    }
  });


  if(app) { console.log('Running app...'); }
})();