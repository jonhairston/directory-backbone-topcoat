
var findById = function (id) {
 
    var deferred = $.Deferred();
    var alert = null;

    var l = this.searchResults.length;
    console.log(l);
    for (var i = 0; i < l; i++) {
        if (this.searchResults[i].id === id) {
            alert = this.searchResults[i];
            break;
        }
    }


    deferred.resolve(alert);
    return deferred.promise();
},

findByName = function (searchKey) {
    var deferred = $.Deferred();
    var results = employees.filter(function (element) {
        var fullName = element.firstName + " " + element.lastName;
        return fullName.toLowerCase().indexOf(searchKey.toLowerCase()) > -1;
    });
    deferred.resolve(results);
    return deferred.promise();
},

findByManager = function (managerId) {
    var deferred = $.Deferred();
    var results = employees.filter(function (element) {
        return managerId === element.managerId;
    });
    deferred.resolve(results);
    return deferred.promise();
};


// here be where our models live 
app.models.Employee = Backbone.Model.extend({

    urlRoot: "https://heads-up.herokuapp.com/api/app/v2/alerts/",
    initialize:function () {
        this.reports = new app.models.ReportsCollection();
        this.reports.parent = this;
    },

    // sync: function(method, model, options) {
    //     if (method === "read") {
           
    //         console.log(method);
    //         modelId = parseInt(this.id);
    //         console.log(modelId);
    //         var findById = function (modelId) {
    //             var deferred = $.Deferred();
    //             var alert = null;




    //         };
            
    //         findById(modelId)
    //         .done(function (data) {
    //              console.log("find by id called");
    //             options.success(data);

    //         });
    //     }
    // }

});

// Employee collection
app.models.EmployeeCollection = Backbone.Collection.extend({

    model: app.models.Employee,
    url: function () {
        return "https://heads-up.herokuapp.com/api/app/v2/alerts/?region=1";
    },

    sync: function(method, model, options) {
        var that = this;
        var params = _.extend({
            type: 'GET',
            dataType: 'json',
            url: that.url(),
            processData: false
        }, options);

        return $.ajax(params);

        if (method === "read") {
            console.log("find by name called");
            findByName(options.data.name).done(function (data) {
                options.success(data);
            });
        }
    }

});

// the collection for the reports
app.models.ReportsCollection = Backbone.Collection.extend({

    model: app.models.Employee,

    // sync: function(method, model, options) {
    //     if (method === "read") {
    //         console.log("find by manager called");
    //         app.adapters.employee.findByManager(this.parent.id).done(function (data) {
    //             options.success(data);
    //         });
    //     }
    // }

});