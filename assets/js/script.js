var appId = "af9ded99d1790eca45328d602b9e06d9";
// searchLocation is a temporary variable that needs to be removed once the search submission is set up
// after search submission is set up, searchLocation needs to be moved to the inside of the search listener/handler
var searchLocation = "Knoxville";
// units sets the input format from OpenWeather, in case we decide to pull a temp or something like that
var units = "imperial";

// userCoordinates and the following two functions activate location services for the page
var userCoordinates = "";
function getUserLocation() {
    if (navigator.geolocation) {
      var userLocation = navigator.geolocation.getCurrentPosition(showPosition);
      console.log(userLocation);
    }
    else {
        alert("Geolocation is not supported by this browser.");
    }
};
function showPosition(position) {
    userCoordinates = position.coords.latitude +
    "+" + position.coords.longitude;
    console.log(userCoordinates);
};

// This function calls the hourly forecast data
var getHourly = function(lat, lon, trName) {fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,&units=" + units + "&appid=" + appId).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                console.log(trName)
                // This gets the hourly forecast
                var hourlyForecast = data.hourly;
                // This trims the forecast down to 8 results
                hourlyForecast.splice(8);
                // This gets the current time hour
                var currentDate = dayjs();
                var currentHour = parseInt(currentDate.format("h"));
                var amPm = currentDate.format("A");
                
                // This loop gets the hourly forecast for each hour
                // At the end of each loop the information is logged
                for (var i = 0; i < hourlyForecast.length; ++i) {
                    if (i >= 1 && forecastHour + i === 12) {
                        switch (amPm) {
                            case "PM":
                                amPM = "AM";
                                break;
                            case "AM":
                                amPm = "PM";
                                break;
                        }

                    }
                    var forecastHour = currentHour + i;
                                        
                    if (forecastHour > 12) {
                        forecastHour = forecastHour - 12;
                    }
                    var forecastTime = forecastHour + " " + amPm;
                    console.log (forecastTime);
                    var forecastCondition = hourlyForecast[i].weather[0].description;
                    if (forecastCondition === "clear sky") {
                        forecastCondition = "clear skies";
                    }
                    
                    // This is what needs to display to the page, preferably only after the user clicks on a trail
                    console.log ("Forecast calls for " + forecastCondition + ".");
                }                
            });
        }
        else {
            alert("Unable to display five day forecast. Please try again");
        }
    });
};

// This toggles trail difficulty rating
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

// This is the function that gets the Location data the first call is to TomTom
var getLocationData = function(searchLocation) {fetch("https://api.tomtom.com/search/2/geocode/" + searchLocation + ".json?key=" + "R3bR5vBrreR1ZaW1HA8lNL9Tjic0vIKa").then(function(response) {
    if (response.ok) {
        response.json().then(function(data) {
            // console.log(data)
                // This retrieves the Lat, Lon, and Place name for the user's search               
                var lat = data.results[0].position.lat;
                var lon = data.results[0].position.lon;
                var resultPlaceName = data.results[0].address.municipality + ", " + data.results[0].address.countrySubdivision + ", " + data.results[0].address.countryCode;
                // This resultPlacename should be displayed at the top of the trail info list
                // It can take the place of the textContent of the h2 that says "Trail Info:"
                console.log(resultPlaceName);
                
                // This is the API call to Hiking Project
                fetch("https://www.hikingproject.com/data/get-trails?lat=" + lat + "&lon=" + lon + "&maxDistance=50&key=200971252-c22ffc62a967b078961e15e7b8f20761").then(function(response){
                    if (response.ok) {
                        response.json().then(function(data) {
                            if (data.trails.length === 0) {
                                console.log("Unable to find any hiking trails within 50 miles of the location you searched.")
                            }
                            else{
                                for (var i = 0; i < data.trails.length; ++i) {
                                    // This gets the difficulty rating
                                    difficultySet(data.trails[i].difficulty)
                                    // This gets the trail ID that is used to get more information from Hiking Project
                                    var trId = data.trails[i].id;
                                    // These get the trail latitude and longitude for the directions and hourly forecast
                                    var trLat = data.trails[i].latitude;
                                    var trLon = data.trails[i].longitude;
                                    // This gets the trail name
                                    var trName = data.trails[i].name;
                                    // This gets the trail description
                                    var trSummary = data.trails[i].summary
                                    // This gets the trail condition (dry, muddy, etc.)
                                    var trCondition = data.trails[i].conditionDetails;
                                    if (!trCondition) {
                                        trCondition = "No condition information has been provided for this trail yet."
                                    }
                                                                        
                                    if (trSummary === "Needs Summary") {
                                        trSummary = "No description has been provided for this trail yet."
                                    }
                                    // This builds a link from the userCoordinates and the trail coordinates to get directions
                                    var directions = "https://google.com/maps/dir/" + userCoordinates + "/" + trLat + "+" + trLon;
                                    // This uses the trail ID to link to more information about the trail on Hiking Project's website
                                    var moreInformation = "https://www.hikingproject.com/trail/" + trId;
                                    // These Logs represent the information that should be displayed to the page under the Trail Info List
                                    // For each Trail, there should be a new div list item with the following as textContent
                                    console.log(trName);
                                    console.log("Lat: " + trLat, "Lon: " + trLon);
                                    console.log(trSummary);
                                    console.log("Condition: " + trCondition, "Difficulty: " + trDifficulty)
                                    console.log(directions);
                                    console.log(moreInformation)
                                    
                                    // This calls the Hourly Forecast using the latitude and longitude for the trail. 
                                    // It also passes in the trail name for easier access.
                                    // Right now getHourly is called every time you run a search, 
                                    // but it would be better if the search only ran when the trail info is clicked
                                    // To do that, I think we will need a listener for a click on the trail div
                                    // This can be done easily with jQuery
                                    getHourly(trLat, trLon, trName);
                                }
                            }
                        })
                    }
                })
            });
            
        }
        else {
            alert("Unable to display information for that location. Make sure it is spelled correctly.");
        }
    });
};


getUserLocation();
getLocationData(searchLocation);