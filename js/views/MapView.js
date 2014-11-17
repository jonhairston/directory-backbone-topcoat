app.views.MapView = Backbone.View.extend({
    initialize: function () {
        // initialize our tile layer
        this.tiles = L.tileLayer('https://{s}.tiles.mapbox.com/v3/mscnswv.hl37jh6m/{z}/{x}/{y}.png', {
            attribution: '<a data-external-url="http://www.mscns.com" target="_system">Powered by MSCNS</a>',
            detectRetina: true
        });

        return this;
    },

    render: function () {
        
        this.$el.html(this.template());
        
        var self = this, primaryLayer, layers;   
        
        console.log("_.delay for maplist has been called!");

        layers = L.control.layers({
            'Streets': this.tiles,
            'Satellite': L.tileLayer('https://{s}.tiles.mapbox.com/v3/mscnswv.il5b6d5o/{z}/{x}/{y}.png', {
                detectRetina: true
            })
        });

        _.delay(function delayedMaplistRender () {  
            // only create the map once
            self.map = new L.map('mapmain', {
                zoomControl: false, // prevent zoom control from being added (instead of removing it later)
                locateControl: true
            }).addLayer(self.tiles);

            // get our primary layer with geoJSON
            primaryLayer = L.mapbox.featureLayer()
                .loadURL('https://heads-up.herokuapp.com/api/app/v2/alert_locations/?region=1')
                .addTo(self.map)
                .on('ready', function loadMapIconsOnReady() {
                    primaryLayer.eachLayer(function mapPanTo(l) {
                        // set our icons and pan to the huntington area
                        l.setIcon(L.icon(l.feature.properties.icon));
                        return self.map.panTo(l.getLatLng());
                    });
                });

            layers.addTo(self.map);
            self.map.setView([38.412, -82.428], 15);
        }, 250);
        

        return this;
    },

    events: {
        "click .back-button": "back"
    },

    back: function() {
        window.history.back();
        return false;
    }

});
