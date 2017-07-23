(function() {
  'use strict';

  var socket = io();
  var app  = new Vue({
    el: '#beaconTable',
    data: {
      mapName: 'map',
      markerCoordinates: [{
            latitude: 14.5528519,
            longitude: 121.05085
      }],
      map: null,
      bounds: null,
      markers: [],
      rows: []
    },
    beforeMount() {
      var self = this;
      self.getVictims();
      socket.on('received-sms', function(rc) {
        self.rows = [].concat([rc], self.rows);
      });
    },
    mounted: function () {
      this.bounds = new google.maps.LatLngBounds();

      const element = document.getElementById('map');
      const mapCentre = this.markerCoordinates[0];
      const options = {
        center: new google.maps.LatLng(mapCentre.latitude, mapCentre.longitude)
      };

      this.map = new google.maps.Map(element, options);

      this.markerCoordinates.forEach((coord) => {
        const position = new google.maps.LatLng(coord.latitude, coord.longitude);
        const marker = new google.maps.Marker({ 
            position,
            map: this.map
        });

        this.markers.push(marker);
        this.map.fitBounds(this.bounds.extend(position));
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
        return 'https://google.com/maps/?q=' + latitude + ',' + longtitude;
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