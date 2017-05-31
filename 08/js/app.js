function init() {
    ko.applyBindings((new AppViewModel));
}

// Models

var city = function(lat, lng) {
    this.lat = lat;
    this.lng = lng;
};
var google = function() {
    var self = this
    this.map
    this.markerList = []
    this.addmarker = function(item) {
        this.markerList.push(item);
    }

};
var resturant = function(name, marker, info) {
    this.name = name;
    this.marker = marker;
    this.info = info;
};
//viewmodell

var AppViewModel = function() {
    var self = this
    this.currentCity = ko.observable("");
    this.newcity = ("new york");
    this.resturantList = ko.observableArray();
    this.searchText = ko.observable("");
    this.resturantInfo
    this.filteredList = ko.computed(function() {
        var filter = self.searchText();
        console.log(filter)
        if (!filter) {
            ko.utils.arrayFilter(self.resturantList(), function(item) {
                item.marker.setVisible(true);
            });
            return self.resturantList();
        } else {
            return ko.utils.arrayFilter(self.resturantList(), function(item) {
                if (stringStartsWith(item.name.toLowerCase(), filter) === true) {
                    item.marker.setVisible(true);
                    return stringStartsWith(item.name.toLowerCase(), filter);
                } else {
                    item.marker.setVisible(false);
                }

            })

        }
    });

    //API functions
    var addResturants = function getResturants(callback) {
        if (typeof callback === 'function') {
            console.log("running")
            console.log(self.google.map);
            service = new google.maps.places.PlacesService(self.google.map);
            service.nearbySearch({
                location: self.currentCity,
                radius: 5000,
                type: ['food'],
                keyword: ['vegan']
            }, callback);

        }
    };

    var asyncgeocodeaddress = function codeAddress(address, callback) {
        geocoder = new google.maps.Geocoder();
        geocoder.geocode({ 'address': address }, callback);
    }

    asyncgeocodeaddress(this.newcity, function callback(results, status) {
        self.currentCity = new city(results[0].geometry.location.lat(), results[0].geometry.location.lng());

        syncCalls()
    })

    //help functions
    var stringStartsWith = function(string, startsWith) {
        string = string || "";
        if (startsWith.length > string.length)
            return false;
        return string.substring(0, startsWith.length) === startsWith;
    };

    //wait and run after special async calls.
    function syncCalls() {

        self.google = new google()
        self.google.map = new google.maps.Map(document.getElementById('map'), {
            zoom: 15,
            center: self.currentCity
        });

        addResturants(function callback(results, status) {
            var bounds = new google.maps.LatLngBounds();
            infowindow = new google.maps.InfoWindow();

            function createHTML(varhtml, htmlobject) {
                if (htmlobject === undefined) {
                    return ""
                } else {

                    return varhtml.replace('%object', htmlobject)
                }
            }
            ko.utils.arrayForEach(results || [], function(item) {
                var marker;
                self.google.addmarker(marker = new google.maps.Marker({
                    position: item.geometry.location,
                    map: self.google.map,
                    title: item.title,
                    animation: google.maps.Animation.DROP,
                }));
                console.log(item.geometry.location.lat())
                    //  lat: 59.334591,
                    // lng: 18.063240
                var lng = item.geometry.location.lng();
                var lat = item.geometry.location.lat();
                var resturantname = item.name
                var category = '<p>category: %object</p>'
                var phone = '<p>phone: %object</p>';
                var homepage = '<p><a href="%object">%homepage</p>'

                var fs = 'https://api.foursquare.com/v2/venues/search?client_id=EDO0PU442DM5XJU3RGBJXJDOVLHTHRNJGMDQACDEFR32WHTR&client_secret=3UNC4A1BANUZHB4H0SDHZQOGDNQORSI2MGNIYXLVSMRZFYC4&v=20150321&ll=' + lat + ',' + lng + '&query=' + resturantname + '&limit=1'
                $.getJSON(fs).done(function(result) {

                    phone = createHTML(phone, result.response.venues[0].contact.formattedPhone);
                    category = createHTML(category, result.response.venues[0].categories[0].shortName)
                    homepage = homepage.replace('%homepage', result.response.venues[0].url)
                    homepage = createHTML(homepage, result.response.venues[0].url);
                    //   console.log("check in count foursquare :" + result.response.venues[0].stats.checkinsCount)
                    //   console.log("category" + result.response.venues[0].categories[0].shortName)
                    response()
                }).fail(function(jqxhr, textStatus, error) {
                    var err = textStatus + ", " + error;
                    console.log("Request Failed:" + err);
                });

                function response() {

                    var info = "<h1>" + item.name + "</h1>" + '<p class ="rating">Rating : ' + item.rating + '</p>' + "<br>" + '<img src="' + item.icon + '">' + "address :" + item.vicinity + category + phone + homepage
                    google.maps.event.addListener(marker, 'click', function() {
                        infowindow.setContent(info);
                        infowindow.open(self.google.map, this);
                        marker.setAnimation(google.maps.Animation.BOUNCE);
                    });

                    self.resturantList.push(new resturant(item.name, marker, info));
                }
            })

            // set googlemap to fit markers.
            for (var i = 0; i < self.google.markerList.length; i++) {
                bounds.extend(self.google.markerList[i].getPosition());
            }
            self.google.map.fitBounds(bounds);
        });



    }

}