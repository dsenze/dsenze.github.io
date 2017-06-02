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
var resturant = function(name, marker, info, rating, locationImg) {
    this.name = name;
    this.marker = marker;
    this.info = info;
    this.rating = rating;
    this.locationImg = locationImg;

};

//API functions
var geocodeaddress = function codeAddress(address, callback) {
    geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': address }, callback);
}

var getData = function getResturants(city, map, callback) {
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

var getFoursquare = function foursquare(lat, lng, resturant) {
    var fs = 'https://api.foursquare.com/v2/venues/search?client_id=EDO0PU442DM5XJU3RGBJXJDOVLHTHRNJGMDQACDEFR32WHTR&client_secret=3UNC4A1BANUZHB4H0SDHZQOGDNQORSI2MGNIYXLVSMRZFYC4&v=20150321&ll=' + lat + ',' + lng + '&query=' + resturant + '&limit=1'
    $.getJSON(fs).done(function(result) {
        var category = '<p>category: %object</p>'
        var phone = '<p>phone: %object</p>';
        var homepage = '<p><a href="%object">%homepage</p>'

        phone = createHTML(phone, result.response.venues[0].contact.formattedPhone);
        category = createHTML(category, result.response.venues[0].categories[0].shortName)
        homepage = homepage.replace('%homepage', result.response.venues[0].url)
        homepage = createHTML(homepage, result.response.venues[0].url);
        response()
    }).fail(function(jqxhr, textStatus, error) {
        var err = textStatus + ", " + error;
        console.log("Request Failed:" + err);
    });
}


//help functions
var stringStartsWith = function(string, startsWith) {
    string = string || "";
    if (startsWith.length > string.length)
        return false;
    return string.substring(0, startsWith.length) === startsWith;
};


var createHTML = function(varhtml, htmlobject) {
    if (htmlobject === undefined) {
        return varhtml.replace('%object', "n/a")
    } else {
        return varhtml.replace('%object', htmlobject)
    }
};

var AppViewModel = function() {
    var self = this
    this.currentCity = ko.observable("");
    this.newcity = ("new york");
    this.resturantList = ko.observableArray()
    this.searchText = ko.observable("");
    this.resturantInfo
    this.bounds
    this.filteredList = ko.computed(function() {
        var filter = self.searchText();
        if (!filter) {
            ko.utils.arrayFilter(self.resturantList(), function(item) {
                // add showmarkeronmap function to each item
                // when user click on item in list it will open infowindow on map.
                item.marker.setVisible(true);
                this.item = ko.observable(item.name), this.showMarkerOnMap = function(obj) {
                    infowindow.setContent(obj.info);
                    infowindow.open(self.google.map, obj.marker);
                    self.google.map.setCenter(obj.marker.getPosition());
                    obj.marker.setAnimation(google.maps.Animation.BOUNCE)
                    $(".filter-map-content").hide()
                    $('.open-menu-button').show()
                    $('.responsive-menu').removeClass('expand')
                }
            });
            return self.resturantList();
        } else {
            infowindow.close();
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


    // start with gecode newcity and wait for recall from google api then start init()
    geocodeaddress(this.newcity, function callback(results, status) {
        self.currentCity = new city(results[0].geometry.location.lat(), results[0].geometry.location.lng());

        init()
    })

    function init() {

        self.google = new google()
        self.google.map = new google.maps.Map(document.getElementById('map'), {
            zoom: 10,
            center: self.currentCity,
            // style fond at snazzy maps: https://snazzymaps.com/style/15883/green-canvas
            styles: [{ "featureType": "all", "elementType": "geometry", "stylers": [{ "color": "#8dc04a" }] }, { "featureType": "all", "elementType": "labels.text.fill", "stylers": [{ "gamma": 0.01 }, { "lightness": 20 }] }, { "featureType": "all", "elementType": "labels.text.stroke", "stylers": [{ "saturation": -31 }, { "lightness": -33 }, { "weight": 2 }, { "gamma": 0.8 }] }, { "featureType": "all", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "landscape", "elementType": "geometry", "stylers": [{ "lightness": 30 }, { "saturation": 30 }] }, { "featureType": "poi", "elementType": "geometry", "stylers": [{ "saturation": 20 }] }, { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "lightness": 20 }, { "saturation": -20 }] }, { "featureType": "road", "elementType": "geometry", "stylers": [{ "lightness": 10 }, { "saturation": -30 }] }, { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "saturation": 25 }, { "lightness": 25 }] }, { "featureType": "water", "elementType": "all", "stylers": [{ "lightness": -20 }] }]


        });

        getData(self.currentCity, self.google.map, function callback(results, status) {
            self.bounds = new google.maps.LatLngBounds();
            infowindow = new google.maps.InfoWindow();

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
                    var getFsData = function foursquare(lat, lng, resturant) {
                        var fs = 'https://api.foursquare.com/v2/venues/search?client_id=EDO0PU442DM5XJU3RGBJXJDOVLHTHRNJGMDQACDEFR32WHTR&client_secret=3UNC4A1BANUZHB4H0SDHZQOGDNQORSI2MGNIYXLVSMRZFYC4&v=20150321&ll=' + lat + ',' + lng + '&query=' + resturant + '&limit=1'
                        $.getJSON(fs).done(function(result) {
                            var category = '<p><strong>category:</strong> %object</p>'
                            var phone = '<p><strong>phone:</strong> %object</p>';
                            var homepage = '<p><strong>homepage : </strong><a href="%object">%homepage</p>'


                            try { phone = createHTML(phone, result.response.venues[0].contact.formattedPhone); } catch (err) {
                                phone = createHTML(phone, undefined)
                            }

                            try { category = createHTML(category, result.response.venues[0].categories[0].shortName); } catch (err) {
                                category = createHTML(category, undefined)
                            }


                            try {
                                var a = result.response.venues[0].url
                                if (a !== undefined) {
                                    homepage = homepage.replace('%homepage', result.response.venues[0].url);
                                    homepage = createHTML(homepage, result.response.venues[0].url);
                                } else {
                                    homepage = ('<p><strong>Homepage: </strong>n/a</p>');
                                }

                            } catch (err) {
                                homepage = ('<p><strong>Homepage: </strong>n/a</p>');
                            }





                            fsResponse(phone, category, homepage)
                        }).fail(function(jqxhr, textStatus, error) {
                            var err = textStatus + ", " + error;
                            console.log("Request Failed:" + err);
                        });
                    }

                    getFsData(item.geometry.location.lat(), item.geometry.location.lng(), item.name)

                    var info = ""

                    function fsResponse(phone, category, homepage) {
                        var rating = createHTML('<p><strong>Rating:</strong> %object</p>', item.rating)
                        var locationUrl = 'https://maps.googleapis.com/maps/api/streetview?size=300x150&location=' + item.geometry.location.lat() + ',' + item.geometry.location.lng() + '&heading=151.78&pitch=-0.76&key=AIzaSyAMr4cPC9-zPpNLCk1yngw1ijaFQ2z-rxM'
                        info = '<div class="content"><h1>' + item.name + '</h1>' + rating + '' + category + phone + homepage + '</div>' + '<img src="' + locationUrl + '">'
                        self.resturantList.push(new resturant(item.name, marker, info, item.rating, locationUrl));
                    }

                    google.maps.event.addListener(marker, 'click', function() {
                        infowindow.setContent(info);
                        infowindow.open(self.google.map, this);
                        self.google.map.setCenter(this.getPosition());
                        marker.setAnimation(google.maps.Animation.BOUNCE);
                    });
                    google.maps.event.addListener(self.google.map, 'click', function() {
                        infowindow.close();

                    });


                }) //end loop

            // set googlemap to fit markers.
            for (var i = 0; i < self.google.markerList.length; i++) {
                self.bounds.extend(self.google.markerList[i].getPosition());
            }
            self.google.map.fitBounds(self.bounds);
        });



    }

}