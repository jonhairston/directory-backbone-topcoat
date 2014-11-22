app.routers.AppRouter = Backbone.Router.extend({

    routes: {
        "":                      "home",
        "alerts/:id":            "alertDetails",
        "map":                   "map"
    },

    initialize: function () {
        app.slider = new PageSlider($('#app'));

    },

    home: function () {
        // Since the home view never changes, we instantiate it and render it only once
        if (!app.homeView) {
            app.homeView = new app.views.HomeView();
            app.homeView.render();
        } else {
            console.log('reusing home view');
            app.homeView.delegateEvents(); // delegate events when the view is recycled
        }
        app.slider.slidePage(app.homeView.$el);
        console.log("homeview has been called!");
    },

    alertDetails: function (id) {
        var employee = new app.models.Employee({id: id});
        employee.fetch({
            success: function (data) {
                // Note that we could also 'recycle' the same instance of EmployeeFullView
                // instead of creating new instances
                app.slider.slidePage(new app.views.EmployeeView({model: data}).render().$el);
                console.log("the detail route has been triggered!");
            }
        });
    },

    map: function () {
        // if(!app.map){
        app.map = new app.views.MapView();

        app.slider.slidePage(app.map.render().$el);
        // } else {
            // app.slider.slidePage(app.map.render().$el);
        // }
        
        console.log("mapview has been called!");


    }

});