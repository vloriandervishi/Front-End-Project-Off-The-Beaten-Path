var appId = "af9ded99d1790eca45328d602b9e06d9";
// searchLocation is a temporary variable that needs to be removed once the search submission is set up
// after search submission is set up, searchLocation needs to be moved to the inside of the search listener/handler
var searchInput = document.getElementById("trail-input-name");
var searchContainerEl = document.getElementById("searchContainer");
var trailSectionEl = document.querySelector("#trail-info-section");


// units sets the input format from OpenWeather, in case we decide to pull a temp or something like that
var units = "imperial";

// userCoordinates and the following two functions activate location services for the page
var userCoordinates = "";
function getUserLocation() {
  if (navigator.geolocation) {
    var userLocation = navigator.geolocation.getCurrentPosition(showPosition);
    console.log("userLocation: ", userLocation);
    console.log(userLocation);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}
function showPosition(position) {
  userCoordinates = position.coords.latitude + "+" + position.coords.longitude;
  console.log(userCoordinates);
}

// This function calls the hourly forecast data
var getHourly = function (lat, lon, trName) {
  fetch(
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
      lat +
      "&lon=" +
      lon +
      "&exclude=minutely,&units=" +
      units +
      "&appid=" +
      appId
  ).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        console.log(trName);
        // This gets the hourly forecast
        var hourlyForecast = data.hourly;
        // This trims the forecast down to 8 results
        hourlyForecast.splice(8);
        // This gets the current time hour
        var currentDate = dayjs();

        // var currentHour = parseInt(currentDate.format("h"));
        // var amPm = currentDate.format("A");

        // This loop gets the hourly forecast for each hour
        // At the end of each loop the information is logged
        var weatherHeadingEl = document.getElementById("weather-info");
        weatherHeadingEl.textContent = trName + " forecast:"
        for (var i = 0; i < hourlyForecast.length; ++i) {
          var forecastHour = currentDate.add(i, "hour").format("h A");
          var forecastCondition = hourlyForecast[i].weather[0].description;
          if (forecastCondition === "clear sky") {
            forecastCondition = "clear skies";
          }
           let byHour=i;
           if(byHour===0){
            var spanEl= document.getElementById("bx1");
            spanEl.textContent='At '+forecastHour + ' expect '+ forecastCondition + ".";
           }else if(byHour===1){
            var spanEl2= document.getElementById("bx2");
            spanEl2.textContent='At '+forecastHour + ' expect '+ forecastCondition + ".";
           }else if(byHour===2){
            var spanEl3= document.getElementById("bx3");
            spanEl3.textContent='At '+forecastHour + ' expect '+ forecastCondition + ".";
           }
           else if(byHour===3){
            var spanEl4= document.getElementById("bx4");
            spanEl4.textContent='At '+forecastHour + ' expect '+ forecastCondition + ".";
           }else if(byHour===4){
            var spanEl5= document.getElementById("bx5");
            spanEl5.textContent='At '+forecastHour + ' expect '+ forecastCondition + ".";
           }
           else if(byHour===5){
            var spanEl6= document.getElementById("bx6");
            spanEl6.textContent='At '+forecastHour + ' expect '+ forecastCondition + ".";
           }else if(byHour===6){
            var spanEl7= document.getElementById("bx7");
            spanEl7.textContent='At '+forecastHour + ' expect '+ forecastCondition + ".";
           }
           else if(byHour===7){
            var spanEl8= document.getElementById("bx8");
            spanEl8.textContent='At '+forecastHour + ' expect '+ forecastCondition + ".";
           }else {
               console.error("something went wrong!");
           }
          // This is what needs to display to the page, preferably only after the user clicks on a trail
          console.log(forecastHour);

          console.log("Forecast calls for " + forecastCondition + ".");
        }
      });
    } else {
      alert("Unable to display five day forecast. Please try again");
    }
  });
};

// This toggles trail difficulty rating
var difficultySet = function (dataSet) {
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
var getLocationData = function (searchLocation) {
  $(".trailDiv").each(function(){
    $(this).remove();
  })
  fetch(
    "https://api.tomtom.com/search/2/geocode/" +
      searchLocation +
      ".json?key=" +
      "R3bR5vBrreR1ZaW1HA8lNL9Tjic0vIKa"
  ).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        // console.log(data)
        // This retrieves the Lat, Lon, and Place name for the user's search
        var lat = data.results[0].position.lat;
        var lon = data.results[0].position.lon;
        var resultPlaceName =
          data.results[0].address.municipality +
          ", " +
          data.results[0].address.countrySubdivision +
          ", " +
          data.results[0].address.countryCode;
        // This resultPlacename should be displayed at the top of the trail info list
        // It can take the place of the textContent of the h2 that says "Trail Info:"
        var trailHeadingEl = document.getElementById("trail-info");
        trailHeadingEl.textContent = resultPlaceName + " trail info:"
        console.log(resultPlaceName);

        // This is the API call to Hiking Project
        fetch(
          "https://www.hikingproject.com/data/get-trails?lat=" +
            lat +
            "&lon=" +
            lon +
            "&maxDistance=50&key=200971252-c22ffc62a967b078961e15e7b8f20761"
        ).then(function (response) {
          if (response.ok) {
            response.json().then(function (data) {
              if (data.trails.length === 0) {
                console.log(
                  "Unable to find any hiking trails within 50 miles of the location you searched."
                );
              } else {
                 for (var i = 0; i < data.trails.length; ++i) {
                // This gets the difficulty rating
                difficultySet(data.trails[i].difficulty);
                // This gets the trail ID that is used to get more information from Hiking Project
                var trId = data.trails[i].id;
                // These get the trail latitude and longitude for the directions and hourly forecast
                var trLat = data.trails[i].latitude;
                var trLon = data.trails[i].longitude;
                // This gets the trail name
                var trName = data.trails[i].name;
                // This gets the trail description
                var trSummary = data.trails[i].summary;
                // This gets the trail condition (dry, muddy, etc.)
                var trCondition = data.trails[i].conditionDetails;
                if (!trCondition) {
                  trCondition =
                    "No condition information has been provided for this trail yet.";
                }

                if (trSummary === "Needs Summary") {
                  trSummary =
                    "No description has been provided for this trail yet.";
                }
                // This builds a link from the userCoordinates and the trail coordinates to get directions
                var directions =
                  "https://google.com/maps/dir/" +
                  userCoordinates +
                  "/" +
                  trLat +
                  "+" +
                  trLon;
                // This uses the trail ID to link to more information about the trail on Hiking Project's website
                var moreInformation =
                  "https://www.hikingproject.com/trail/" + trId;
                // These Logs represent the information that should be displayed to the page under the Trail Info List
                // For each Trail, there should be a new div list item with the following as textContent
               // console.log(trName);
                var trailDivEl = document.createElement("div");
                trailDivEl.classList ="trailDiv box has-background-danger-dark has-text-white";
                var ulEl = document.createElement("ul");
                var liEl = document.createElement("li");
                liEl.innerHTML ="<span id='thisTrName'>" + trName + "</span>";
                var trliEl = document.createElement("li");
                trliEl.textContent = trName;
                
               // console.log("Lat: " + trLat, "Lon: " + trLon);
                var latliEl=document.createElement('li');
                var trSliEl=document.createElement('li');
                trSliEl.textContent=trSummary;
                latliEl.innerHTML="Lat: <span id='thisTrLat'>" + trLat + "</span> Lon: <span id='thisTrLon'>" + trLon + "</span>";
                //console.log(trSummary);

                var trliEl = document.createElement("li");
                trliEl.textContent = "Trail condition: " + trCondition;
                //  console.log("Trail condition: " + trCondition);
                var trdliEl = document.createElement("li");
                trdliEl.textContent = "Difficulty: " + trDifficulty;
                // console.log("Difficulty: " + trDifficulty);

                direliEl.innerHTML = "<a href='" + directions + "' target='_blank'>Directions</a>";
              //  console.log(directions);
                var infoliEl=document.createElement('li');
                infoliEl.innerHTML = "<a href='" + moreInformation + "' target='_blank'>More Information</a>";
              //  console.log(moreInformation);
                
               
                ulEl.append(liEl,trSliEl, trliEl,latliEl,trliEl,trdliEl,direliEl,infoliEl);
                trailDivEl.append(ulEl);
                trailSectionEl.append(trailDivEl);
              }
                // This calls the Hourly Forecast using the latitude and longitude for the trail.
                // It also passes in the trail name for easier access.
                // Right now getHourly is called every time you run a search,
                // but it would be better if the search only ran when the trail info is clicked
                // To do that, I think we will need a listener for a click on the trail div
                // This can be done easily with jQuery
                
                // }
              }
            });
          }
        });
      });
    } else {
      alert(
        "Unable to display information for that location. Make sure it is spelled correctly."
      );
    }
  });
};

var locationSubmitHandler = function(event) {
    event.preventDefault();
    console.log("I was submitted!");
    var searchLocation = searchInput.value;
    getLocationData(searchLocation);
    console.log(searchLocation);
  };


searchContainerEl.addEventListener("submit", locationSubmitHandler);

$("#trail-info-section").on("click", "div", function(){
  var thisTrName = $(this).find("#thisTrName").text();
  console.log(thisTrName);
  var thisTrLat= $(this).find("#thisTrLat").text();
  console.log(thisTrLat);
  var thisTrLon= $(this).find("#thisTrLon").text();
  console.log(thisTrLon);
  getHourly(thisTrLat, thisTrLon, thisTrName);
});

getUserLocation();
