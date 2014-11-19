app.views.EmployeeView = Backbone.View.extend({
    initialize: function () {
        this.mapUUID = (this.model.get('map').id || null);
        console.log("This is the map id: " + this.mapUUID);

        // load the map tiles only if we have an id
        if (this.mapUUID) {
            // tile layer
            this.tiles = L.tileLayer('https://{s}.tiles.mapbox.com/v3/mscnswv.il5b6d5o/{z}/{x}/{y}.png', {
                attribution: '<a href="http://www.mscns.com" target="_blank">Powered by MSCNS</a>',
                detectRetina: true
            });

        } // end if
        return this;

        this.model.on('destroy', this.close, this);
    },

    render: function () {
       
        this.$el.html(this.template(this.model.attributes));

        var self = this, primaryLayer, layers;

        // now if we have a mapUUID then draw the map
        if (this.mapUUID) {

            layers = L.control.layers({
                'Satellite': this.tiles,
                'Streets': L.tileLayer('https://{s}.tiles.mapbox.com/v3/mscnswv.hl37jh6m/{z}/{x}/{y}.png', {
                    detectRetina: true
                })
            });

            _.delay(function delayedDetailMapRender () {
                // create our map
                self.map = new L.map('single-map', {
                    zoomControl: false, // prevent zoom todo: fix this
                    locateControl: false
                }).addLayer(self.tiles);

                // create our primary layer and get our data from the alert_locations/pk resource
                // uses the pk of the alert 
                primaryLayer = L.mapbox.featureLayer()
                    .loadURL('https://heads-up.herokuapp.com/api/app/v2/alert_locations/' + self.model.get('id') + '/')
                    .addTo(self.map)
                    // when ready load our icons (if any) and pan to the desired area
                    .on('ready', function loadMapIconsOnReady () { 
                        primaryLayer.eachLayer(function mapPanTo (l) {
                            l.setIcon(L.icon(l.feature.properties.icon));
                            return self.map.panTo(l.getLatLng());
                        });
                    }); 

                // add our layer to the map
                layers.addTo(self.map);

                self.map.setView([38.412, -82.428], 17);


            }, 250);


        } // end if 


        return this;
    },

    events: {
        "click .back-button": "back"
    },

    onClose: function () {
        console.log("help ive been killed!");
        this.unbind();
        this.remove();
    },

    back: function(event) {
        window.history.back();
        return false;
    }

});
