app.views.EmployeeListView = Backbone.View.extend({

    tagName:'ul',

    attributes: {class: 'topcoat-list list border-bottom-1'},

    initialize:function () {
        var self = this;
        this.model.on("reset", this.render, this);
        this.model.on("add", function (employee) {
            self.$el.append(new app.views.EmployeeListItemView({model:employee}).render().el);
        });
    },

    render:function () {
        this.$el.empty();
        _.each(this.model.models, function (employee) {
            this.$el.append(new app.views.EmployeeListItemView({model:employee}).render().el);
        }, this);
        return this;
    }
});

app.views.EmployeeListItemView = Backbone.View.extend({

    tagName:"li",

    className:"topcoat-list__item nopadding no-border-bottom white-background list-text-color",

    initialize:function () {
        this.model.on("change", this.render, this);
        // getting rid of zambie views
        this.model.on("destroy", this.close, this);
    },

    render:function () {
        this.$el.html(this.template(this.model.attributes));
        $
        return this;
    }

});