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
        console.log("blee");
        var self = this, primaryLayer, layers;   
        
        console.log("_.delay for maplist has been called!");

           this.tiles = L.tileLayer('https://{s}.tiles.mapbox.com/v3/mscnswv.hl37jh6m/{z}/{x}/{y}.png', {
                attribution: '<a data-external-url="http://www.mscns.com" target="_system">Powered by MSCNS</a>',
                detectRetina: true
            });

        layers = L.control.layers({
            'Streets': this.tiles,
            'Satellite': L.tileLayer('https://{s}.tiles.mapbox.com/v3/mscnswv.il5b6d5o/{z}/{x}/{y}.png', {
                detectRetina: true
            })
        });

        _.delay(function delayedMaplistRender () {  
         
            
            // only create the map once however if this gets spammed it WILL BREAK!
            console.log("the map list view does not exist yet, creating...");
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
            self.map.setView([38.412, -82.428], 13);
        }, 750);
        

        return this;
    },

    events: {
        "click .back-button": "back"
    },

    back: function() {
        window.history.back();
        return false;
    }

    // destroy_view: function() {

    // //COMPLETELY UNBIND THE VIEW
    // this.undelegateEvents();

    // this.$el.removeData().unbind(); 

    // //Remove view from DOM
    // this.remove();  
    // Backbone.View.prototype.remove.call(this);

    // }

});
