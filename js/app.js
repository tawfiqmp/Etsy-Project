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
				}

				var Etsy = new EtsyClient(options);

	})

}


function EtsyClient(options) {
    if (!options.api_key) {
        throw new Error("Yo dawg, I heard you like APIs. Y U NO APIKEY!?!?");
    }
    this.etsy_url = "https://openapi.etsy.com/";
    this.version = options.api_version || "v2/";
    this.api_key = options.api_key;
    this.complete_api_url = this.etsy_url + this.version;
    this.init();
}

EtsyClient.prototype.pullAllActiveListings = function() {

	var model = 'listings/';
	var filter = 'active';
	return $.getJSON(this.complete_api_url + model + filter + ".js?api_key=" + this.api_key + "&includes=Images&callback=?").then(function(data) {
        return data;
    });
};

EtsyClient.prototype.loadTemplate = function(name) {

	return $.get("./"+name+".html").then(function(htmlString){
		return htmlString;
	})
}

EtsyClient.prototype.getListingInfo = function(id) {
    var model = 'listings';
    return $.getJSON(this.complete_api_url + model + '/' + id + ".js?api_key=" + this.api_key + "&callback=?").then(function(data) {
        return data;
    });
};


EtsyClient.prototype.drawListings = function(listingsHtml, listings){
	var main = document.querySelector("#listings");

	var stringHtml = listings.results.map(function(listing){
		return _.template(listingsHTML, listing);
	}).join('');

}

EtsyClient.prototype.drawSingleListing = function(id){

	var listing = this.latestData.results.fitler(function(listing){
	return listing.listing_id === parseInt(id);

	});

	var main = document.querySelector("#listings");

	var stringHTML = _.template(this.singleListingHTML, listing[0]);

	main.innerHTML = stringHTML;

}

EtsyClient.prototype.setupRouting = function() {}

EtsyClient.prototype.getUserInfo = function() {


    return $.getJSON(this.complete_api_url + "users/'user_id'.js?api_key=" + this.api_key + "&callback=?").then(function(data) {
        return data;
    });
};

EtsyClient.prototype.init = function(){
	var self = this;
	// this.setupRouting();
	$.when(
		this.pullAllActiveListings(),
		this.loadTemplate("listings"),
		this.loadTemplate("listing")
	).then(function(data, html, singlePageHTML){

			self.listingHTML = html;
			self.newData = data;
			self.singleListingHtml = singlePageHTML;

			Path.listen();	
		})

}


