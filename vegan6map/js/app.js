// Models

//city used to store lat and lng for currentcity.
var city = function(lat, lng) {
    this.lat = lat;
    this.lng = lng;
};

// holds google map and all markers.
var google = function() {
    var self = this
    this.map
    this.markerList = []
    this.addmarker = function(item) {
        this.markerList.push(item);
    }

};
// resturant properties like name, marker, infowindow and foursquare data.
var resturant = function(name, marker, info, rating, locationImg, infoWindow, phone, homepage, category) {
    this.name = name;
    this.marker = marker;
    this.info = info;
    this.infoWindow = infoWindow;
    this.rating = rating;
    this.locationImg = locationImg;
    //fs data contains forthsquare from API. 
    this.fsData = []
    this.updateFsdata = function(phone, homepage, category) {
        this.fsData.push({
            "category": category,
            "phone": phone,
            "homepage": homepage
        })
    }



};


var AppViewModel = function() {
    var self = this
        // this.currentCity = this.newCity 
        // TODO add possiblity to update currentcity with newcity for user.
    this.currentCity = ko.observable("");
    this.newcity = ("new york"); //TODO. make this dynamical with google 
    this.bounds
    this.resturantList = ko.observableArray()
    this.searchText = ko.observable("");
    this.foursquareError = false;
    this.filteredList = ko.computed(function() {
        var filter = self.searchText();
        if (!filter) {
            ko.utils.arrayFilter(self.resturantList(), function(item) {
                // add showmarkeronmap function to each item
                // when user click on item in list it will open infowindow on map.
                item.marker.setVisible(true);
                this.item = ko.observable(item.name), this.showMarkerOnMap = function(obj) {
                    obj.infoWindow.setContent(obj.info);
                    obj.infoWindow.open(self.google.map, obj.marker);
                    self.google.map.setCenter(obj.marker.getPosition());
                    obj.marker.setAnimation(google.maps.Animation.BOUNCE)
                    $(".filter-map-content").hide()
                    $('.open-menu-button').show()
                    $('.responsive-menu').removeClass('expand')
                }
            });
            return self.resturantList();
        } else {

            return ko.utils.arrayFilter(self.resturantList(), function(item) {
                item.infoWindow.close();
                if (self.stringStartsWith(item.name.toLowerCase(), filter) === true) {
                    item.marker.setVisible(true);
                    return self.stringStartsWith(item.name.toLowerCase(), filter);
                } else {
                    item.marker.setVisible(false);

                }

            })

        }
    });


    //API Functions
    this.APIgeocodeaddress = function geocodeaddress(address, callback) {
        geocoder = new google.maps.Geocoder();
        geocoder.geocode({ 'address': address }, callback);
    };

    this.APIgetPlaces = function getPlaces(city, map, callback) {
        if (typeof callback === 'function') {
            service = new google.maps.places.PlacesService(map);
            service.nearbySearch({
                location: city,
                radius: 1500,
                type: ['food'],
                keyword: ['vegan']
            }, callback);

        }
    };

    this.APIfourSquare = function foursquare(item, lat, lng, resturant) {
        var fs = 'https://api.foursquare.com/v2/venues/search?client_id=EDO0PU442DM5XJU3RGBJXJDOVLHTHRNJGMDQACDEFR32WHTR&client_secret=3UNC4A1BANUZHB4H0SDHZQOGDNQORSI2MGNIYXLVSMRZFYC4&v=20150321&ll=' + lat + ',' + lng + '&query=' + resturant + '&limit=1'
        $.getJSON(fs).done(function(result) {
            var phone, homepage, category;
            try { phone = result.response.venues[0].contact.formattedPhone; } catch (err) {
                phone = undefined;
            }
            try { category = result.response.venues[0].categories[0].shortName; } catch (err) {
                category = undefined;
            }
            try { homepage = result.response.venues[0].url; } catch (err) {
                homepage = undefined;
            }



            self.APIcallbFoursquare(item, phone, category, homepage)
        }).fail(function(jqxhr, textStatus, error) {
            if (self.errorForsquare !== true) {
                self.errorForsquare = true;
                alert("issue getting foursquare data. Resturants will be missing foursquare data ")
            }
        });
    }

    this.APIcallbFoursquare = function foursquareResponse(item, phone, category, homepage) {

        // var rating = createHTML('<p><strong>Rating:</strong> %object</p>', item.rating)
        // var locationUrl = 'https://maps.googleapis.com/maps/api/streetview?size=300x150&location=' + item.geometry.location.lat() + ',' + item.geometry.location.lng() + '&heading=151.78&pitch=-0.76&key=AIzaSyAMr4cPC9-zPpNLCk1yngw1ijaFQ2z-rxM'
        // info = '<div class="content"><h1>' + item.name + '</h1>' + rating + '' + category + phone + homepage + '</div>' + '<img src="' + locationUrl + '">'
        // self.resturantList.push(new resturant(item.name, marker, info, item.rating, locationUrl));
        item.updateFsdata(self.removeUndefined(phone), self.removeUndefined(homepage), self.removeUndefined(category));
        self.updateInfoWindow(item);

    }

    this.updateInfoWindow = function updateInfoWindow(obj) {
        var hp;
        if (obj.fsData[0].homepage === "n/a") {
            var hp = '<p><strong>homepage : </strong>n/a</p>'
        } else {
            var hp = '<p><strong>homepage : </strong><a href="' + obj.fsData[0].homepage + '">' + obj.fsData[0].homepage + '</p>'
        }

        var content = '<div class="content"><h1>' + obj.name + '</h1>' + '<p><strong>Rating: </strong>' + obj.rating + '</p>' + '<p><strong>Category: </strong>' + obj.fsData[0].category + '</p>' + '<p><strong>Phone: </strong>' + obj.fsData[0].phone + '</p>' + hp + '<img src="' + obj.locationImg + '">'

        obj.info = content;
        google.maps.event.addListener(obj.marker, 'click', function() {
            obj.infoWindow.setContent(content);
            obj.infoWindow.open(self.google.map, this);
            obj.marker.setAnimation(google.maps.Animation.BOUNCE);
        });

    };

    this.addFSinfo = function() {
        ko.utils.arrayForEach(self.resturantList() || [], function(item) {
            self.APIfourSquare(item, item.marker.getPosition().lat(), item.marker.getPosition().lng(), item.name)

        });

    };
    //help functions
    this.stringStartsWith = function(string, startsWith) {
        string = string || "";
        if (startsWith.length > string.length)
            return false;
        return string.substring(0, startsWith.length) === startsWith;
    };
    // replace undefined properties with "n/a" 
    this.removeUndefined = function(object) {
        if (object === undefined) {
            return "n/a"
        } else {
            return object
        }
    };
    //Update places with foursquare API data information.

    // start with geocode newcity and wait for recall from google api then start init()
    this.APIgeocodeaddress(this.newcity, function callback(results, status) {
        try {
            self.currentCity = new city(results[0].geometry.location.lat(), results[0].geometry.location.lng());
        } catch (err) {
            alert("Error loading GoogleMap. Address could not be geocoded.")
        }
        init();
    })

    // init get started after geocodeAddress call.
    function init() {


        try {
            self.google = new google()
            self.google.map = new google.maps.Map(document.getElementById('map'), {
                zoom: 10,
                center: self.currentCity,
                // style found at snazzy maps: https://snazzymaps.com/style/15883/green-canvas
                styles: [{ "featureType": "all", "elementType": "geometry", "stylers": [{ "color": "#8dc04a" }] }, { "featureType": "all", "elementType": "labels.text.fill", "stylers": [{ "gamma": 0.01 }, { "lightness": 20 }] }, { "featureType": "all", "elementType": "labels.text.stroke", "stylers": [{ "saturation": -31 }, { "lightness": -33 }, { "weight": 2 }, { "gamma": 0.8 }] }, { "featureType": "all", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "landscape", "elementType": "geometry", "stylers": [{ "lightness": 30 }, { "saturation": 30 }] }, { "featureType": "poi", "elementType": "geometry", "stylers": [{ "saturation": 20 }] }, { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "lightness": 20 }, { "saturation": -20 }] }, { "featureType": "road", "elementType": "geometry", "stylers": [{ "lightness": 10 }, { "saturation": -30 }] }, { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "saturation": 25 }, { "lightness": 25 }] }, { "featureType": "water", "elementType": "all", "stylers": [{ "lightness": -20 }] }]
            })
        } catch (err) {
            alert("could not load googlemap")
            console.log(err)

        }

        // take place information from placesService and save it to resturantList as resturantObjects.
        self.APIgetPlaces(self.currentCity, self.google.map, function callback(results, status) {
            self.bounds = new google.maps.LatLngBounds();
            var infoWindow = new google.maps.InfoWindow();

            // loop resturant result.
            ko.utils.arrayForEach(results || [], function(item) {
                //add marker to google model.
                var marker;
                self.google.addmarker(marker = new google.maps.Marker({
                    position: item.geometry.location,
                    map: self.google.map,
                    title: item.title,
                    animation: google.maps.Animation.DROP
                }));

                var locationUrl = 'https://maps.googleapis.com/maps/api/streetview?size=300x150&location=' + item.geometry.location.lat() + ',' + item.geometry.location.lng() + '&heading=151.78&pitch=-0.76&key=AIzaSyAMr4cPC9-zPpNLCk1yngw1ijaFQ2z-rxM'
                var info = '<div class="content"><h1>' + item.name + '</h1>' + '<p><strong>Rating: </strong>' + item.rating + '</p>' + '<img src="' + locationUrl + '">'
                self.resturantList.push(new resturant(item.name, marker, info, self.removeUndefined(item.rating), locationUrl, infoWindow, "NA", "NA", "NA"));


                //add listeners for each result.

                google.maps.event.addListener(marker, 'click', function() {
                    infoWindow.setContent(info);
                    infoWindow.open(self.google.map, this);
                    marker.setAnimation(google.maps.Animation.BOUNCE);
                });


            });

            //add listeners for map.
            google.maps.event.addListener(self.google.map, 'click', function() {
                infoWindow.close();

            });

            // set googlemap to fit markers.
            for (var i = 0; i < self.google.markerList.length; i++) {
                self.bounds.extend(self.google.markerList[i].getPosition());
            }
            self.google.map.fitBounds(self.bounds);
            self.addFSinfo();
        });




    } //init end


}


function initialize() {
    // add eventlisteners to menu buttons.
    $(".open-menu-button").click(function() {
        $(".filter-map-content").show()
        $('.responsive-menu').toggleClass('expand')
        $('.open-menu-button').hide()

    });
    $(".close-menu-button").click(function() {
        $(".filter-map-content").hide()
        $('.open-menu-button').show()
        $('.responsive-menu').removeClass('expand')
    });

    ko.applyBindings((new AppViewModel));
}