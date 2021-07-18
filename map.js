//map.js

//Set up some of our variables.
var map; //Will contain map object.
var marker = false; ////Has the user plotted their location marker? 

//Function called to initialize / create the map.
//This is called when the page has loaded.
let panorama;
let userLat, userLong, selectedLat, selectedLong, locationSelected, currentPano;
let flightPath;
function initMap() {

    //The center location of our map.
    var centerOfMap = new google.maps.LatLng(52.357971, -6.516758);

    //Map options.
    // var options = {
    //   center: centerOfMap, //Set center.
    //   zoom: 7 //The zoom value.
    // };
    var options = {
        zoom: 2,
        minZoom: 2,
        center: centerOfMap,
        mapTypeControlOptions: {
            mapTypeIds: [google.maps.MapTypeId.ROADMAP]
        }, // here´s the array of controls
        disableDefaultUI: true, // a way to quickly hide all controls
        mapTypeControl: true,
        scaleControl: true,
        zoomControl: true,
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.LARGE
        },
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        gestureHandling: "greedy",

    };

    //Create the map object.
    map = new google.maps.Map(document.getElementById('map'), options);

    //Listen for any clicks on the map.
    google.maps.event.addListener(map, 'click', function (event) {
        //Get the location that the user clicked.
        var clickedLocation = event.latLng;
        //If the marker hasn't been added.
        if (marker === false) {
            //Create the marker.
            marker = new google.maps.Marker({
                position: clickedLocation,
                map: map,
                draggable: true //make it draggable
            });
            //Listen for drag events!
            google.maps.event.addListener(marker, 'dragend', function (event) {
                markerLocation();
            });
        } else {
            //Marker has already been added, so just change its location.
            marker.setPosition(clickedLocation);
        }
        //Get the marker's location.
        markerLocation();
    });
    panorama = new google.maps.StreetViewPanorama(
        document.getElementById("street-view"),
        {
            position: { lat: 37.86926, lng: -122.254811 },
            pov: { heading: 165, pitch: 0 },
            zoom: 1,
            disableDefaultUI: true,
            zoomControl: true,
            panControl: true,
            showRoadLabels: false
        }
    )
}

//This function will get the marker's current location and then add the lat/long
//values to our textfields so that we can save the location.
function markerLocation() {
    //Get location.<div id="button"></div>
    marker.setMap(map);
    var currentLocation = marker.getPosition();

    //Add lat and lng values to a field that we can save.
    selectedLat = currentLocation.lat(); //latitude
    selectedLong = currentLocation.lng(); //longitude
}

google.maps.event.addDomListener(window, 'load', initMap);

function TryRandomLocation(callback) {
    var lat = (Math.random() * 180) - 90;
    var lng = (Math.random() * 360) - 180;
    var sv = new google.maps.StreetViewService();
    sv.getPanorama({
        location: new google.maps.LatLng(lat, lng),
        radius: 10000
    }, callback);
}

function HandleCallback(data, status) {
    if (status == 'OK') {
        currentPano = data.location.pano;
        panorama.setPano(currentPano)
        userLat = data.location.latLng.lat()
        userLong = data.location.latLng.lng()
        console.log(userLat + ":" + userLong)
    } else {
        TryRandomLocation(HandleCallback);
    }
}

window.onload = function () {
    TryRandomLocation(HandleCallback);
}

function addLine() {
    flightPath.setMap(map);
}

function removeLine() {
    flightPath.setMap(null);
}

result = document.getElementById("distance");

function calculate() {
    if (selectedLat && selectedLong && !locationSelected) {
        locationSelected = true;
        flightPath = new google.maps.Polyline({
            path: [
                { lat: userLat, lng: userLong },
                { lat: selectedLat, lng: selectedLong },
            ],
            geodesic: false,
            strokeColor: "#FF0000",
            strokeOpacity: 1.0,
            strokeWeight: 2,
        });
        var distanceInMeters = google.maps.geometry.spherical.computeDistanceBetween(
            new google.maps.LatLng({ lat: userLat, lng: userLong }),
            new google.maps.LatLng({ lat: selectedLat, lng: selectedLong })
        );
        let dist = distanceInMeters * 0.001;
        result.value = "You are " + dist.toFixed() + " km away."
        addLine(flightPath);
    }
}

function removeMarker(){
    marker.setMap(null);
}

function newGame() {
    removeLine();
    removeMarker();
    result.value = "";
    locationSelected = false;
    TryRandomLocation(HandleCallback);
}

function goToHome(){
    if(currentPano)
        panorama.setPano(currentPano);
}