window.onload = app;

function app() {

    loader.load({

        url: "./bower_components/lodash/dist/lodash.min.js"
    }, {
        url: "./bower_components/jquery/dist/jquery.min.js"
    }, {
        url: "./bower_components/pathjs/path.min.js"

    }).then(function() {
        _.templateSettings.interpolate = /{([\s\S]+?)}/g;

        var options = {

            api_key: "a915oo2cz2luwfpsetg6uefe"
        };

        var Etsy = new EtsyClient(options);

    });

}


function EtsyClient(options) {
    if (!options.api_key) {
        throw new Error("Yo dawg, I heard you like APIs. Y U NO APIKEY!?!?");
    }
    this.etsy_url = "https://openapi.etsy.com/";
    this.version = options.api_version || "v2/";
    this.api_key = options.api_key;
    this.complete_api_url = this.etsy_url + this.version;
    this.setupRouting();
}


EtsyClient.prototype.pullAllActiveListings = function() {

    var model = 'listings';
    var filter = 'active';
    return $.getJSON(this.complete_api_url + model + '/' + filter + ".js?api_key=" + this.api_key + "&includes=Images&callback=?").then(function(data) {
        return data;
    });
};


EtsyClient.prototype.pullSingleListing = function(id) {
    var model = 'listings';
    return $.getJSON(this.complete_api_url + model + '/' + id + ".js?api_key=" + this.api_key + "&includes=Images&callback=?").then(function(data) {
        return data;
    });
};

EtsyClient.prototype.loadTemplate = function(name) {

    return $.get("./templates/" + name + ".html").then(function() {
        return arguments[0];
    });
};


EtsyClient.prototype.drawListings = function(listingsHtml, listings) {
    var main = document.querySelector("#listings");

    var stringHtml = listings.results.map(function(listing) {
        return _.template(listingsHtml, listing);
    }).join('');

    main.innerHtml = stringHtml;

};


EtsyClient.prototype.drawSingleListing = function(id) {

    var listing = this.latestData.results.fitler(function(listing) {
        return listing.listing_id === parseInt(id);

    });

    var main = document.querySelector("#listings");

    var stringHtml = _.template(this.singleListingHtml, listing[0]);

    main.innerHTML = stringHtml;

};


EtsyClient.prototype.setupRouting = function() {
    var self = this;


    Path.map("#/").to(function() {
        $.when(
        	self.loadTemplate("listing"),
        	self.pullAllActiveListings()
        ).then(function() {
            self.drawListings(arguments[0], arguments[1]);

        	console.dir(self)

        })

    });


        // EtsyClient.prototype.getUserInfo = function() {


        //     return $.getJSON(this.complete_api_url + "users/'user_id'.js?api_key=" + this.api_key + "&callback=?").then(function(data) {
        //         return data;
        //     });
        // };

    Path.map("#/listing/:id").to(function() {
        alert(this.params.anymessage);
        })

    Path.map("#/listing/:id").to(function() {
        $.when(
            self.loadTemplate("listing"),
            self.pullSingleListing(this.params.id)
        ).then(function() {

    		self.drawSingleListing(arguments[0], arguments[1]);
    	})
    });

	Path.root("#/");
	Path.listen();

}


        // EtsyClient.prototype.init = function() {
        //         var self = this;
        //         // this.setupRouting();
        //         $.when(
        //             this.pullAllActiveListings(),
        //             this.loadTemplate("listings"),
        //             this.loadTemplate("listing")
        //         ).then(function(data, html, singlePageHTML) {

        //             self.newData = data;
        //             self.listingHTML = html;
        //             self.singleListingHtml = singlePageHTML;

        //             Path.listen();
        //         });

        //     };
