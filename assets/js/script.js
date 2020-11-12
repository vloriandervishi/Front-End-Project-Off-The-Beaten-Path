var appId = "af9ded99d1790eca45328d602b9e06d9";
var city = "Knoxville";
var units = "imperial";
var userCoordinates = "";


// toggle trail difficulty
var difficultySet = function(dataSet) {
    switch (dataSet) {
        case "green":
            trDifficulty = "Beginner";
            break;
        case "greenBlue": 
            trDifficulty = "Beginner to Intermediate";
            break;
        case "blue":
            trDifficulty = "Intermediate";
            break;
        case "blueBlack":
            trDifficulty = "Intermediate to Expert";
            break;
        case "black":
            trDifficulty = "Expert";
            break;
    }
};

var getLocationData = function(city) {fetch("https://api.tomtom.com/search/2/geocode/" + city + ".json?key=" + "R3bR5vBrreR1ZaW1HA8lNL9Tjic0vIKa").then(function(response) {
    if (response.ok) {
        response.json().then(function(data) {
            console.log(data)
   
                
                var lat = data.results[0].position.lat;
                var lon = data.results[0].position.lon;
                var resultPlaceName = data.results[0].address.municipality + ", " + data.results[0].address.countrySubdivision + ", " + data.results[0].address.countryCode;
                console.log(resultPlaceName);
                
                fetch("https://www.hikingproject.com/data/get-trails?lat=" + lat + "&lon=" + lon + "&maxDistance=50&key=200971252-c22ffc62a967b078961e15e7b8f20761").then(function(response){
                    if (response.ok) {
                        response.json().then(function(data) {
                            if (data.trails.length === 0) {
                                console.log("Unable to find any hiking trails within 50 miles of the location you searched.")
                            }
                            else{
                                for (var i = 0; i < data.trails.length; ++i) {
                                    difficultySet(data.trails[i].difficulty)
                                    var trId = data.trails[i].id;
                                    var trLat = data.trails[i].latitude;
                                    var trLon = data.trails[i].longitude;
                                    var trName = data.trails[i].name;
                                    var trSummary = data.trails[i].summary
                                    var trCondition = data.trails[i].conditionDetails;
                                    if (!trCondition) {
                                        trCondition = "No condition information has been provided for this trail yet."
                                    }
                                                                        
                                    if (trSummary === "Needs Summary") {
                                        trSummary = "No description has been provided for this trail yet."
                                    }
                                    var directions = "https://google.com/maps/dir/" + userCoordinates + "/" + trLat + "+" + trLon;
                                    var moreInformation = "https://www.hikingproject.com/trail/" + trId;
                                    console.log(trName);
                                    console.log("Lat: " + trLat, "Lon: " + trLon);
                                    console.log(trSummary);
                                    console.log("Condition: " + trCondition, "Difficulty: " + trDifficulty)
                                    console.log(directions);
                                    console.log(moreInformation)
                                    // getHourly(trLat, trLon, trName);
                                }
                            }
                        })
                    }
                })
            });
            
        }
        else {
            alert("Unable to display information for that city. Make sure it is spelled correctly.");
        }
    });
};

getLocationData(city);