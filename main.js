let cityInput = document.getElementById("city");
let searchBtn = document.getElementById("search-city");
let cityName = document.getElementById("city-name");
let temperature = document.getElementById("temperature");
let cloud = document.getElementById("cloud");
let cloudImg = document.getElementById("cloud-img");
let humidity = document.getElementById("humidity");
let wind = document.getElementById("wind");
let cardContent = document.getElementById("card-content");
let span = document.getElementById("span");
const loadingContainer = document.getElementById("loading");

// Show loading animation
// loadingContainer.style.display = "block";

// console.log(eval(temperature.innerHTML));
let f = parseFloat(temperature.innerHTML);

function babckgroundImage() {
  if (parseFloat(temperature.innerHTML) < 5) {
    document.body.style.backgroundImage = "url(images/snowbi.png)";
  } else if (
    5 < parseFloat(temperature.innerHTML) &&
    parseFloat(temperature.innerHTML) < 10
  ) {
    document.body.style.backgroundImage = "url(images/rainbi.png)";
  } else if (
    10 < parseFloat(temperature.innerHTML) &&
    parseFloat(temperature.innerHTML) < 15
  ) {
    document.body.style.backgroundImage = "url(images/drizzlebi.png)";
  } else if (
    15 < parseFloat(temperature.innerHTML) &&
    parseFloat(temperature.innerHTML) < 25
  ) {
    document.body.style.backgroundImage = "url(images/mistbi.png)";
  } else if (25 < parseFloat(temperature.innerHTML)) {
    document.body.style.backgroundImage = "url(images/clearbi.png)";
  }
}

let apiKey = "89b679ca4eaf51fc0ec6c700a3ee930e";

searchBtn.addEventListener("click", () => {
  let city = cityInput.value;
  if (cityInput.value != "") {
    showLoadingAnimation(); // Show loading animation
    fetchWeather(city);
    cityInput.value = "";
  } else {
    cityName.innerHTML = "";
    temperature.innerHTML = "";
    cloud.innerHTML = "";
    humidity.innerHTML = "";
    wind.innerHTML = "";
  }
});
function showLoadingAnimation() {
  loadingContainer.style.display = "flex"; // Show loading animation
}
function hideLoadingAnimation() {
  loadingContainer.style.display = "none"; // Hide the loading animation
}
function dsiplayData(data) {
  if (data.name === undefined) {
    cityName.innerHTML = "";
    temperature.innerHTML = "";
    cloud.innerHTML = "";
    humidity.innerHTML = "";
    wind.innerHTML = "";
    span.innerHTML = "Please check city name";
    span.style.cssText =
      "font-size=18px; color:red;font-weight:700;text-align:center";
    cityInput.value == data.name;
  } else {
    cityName.innerHTML = data.name;
    temperature.innerHTML = (data.main.temp - 273.15).toFixed(1) + "°C";
    cloud.innerHTML = data.weather[0].description;
    humidity.innerHTML = "Humidity:" + data.main.humidity + "%";
    wind.innerHTML = "wind:" + data.wind.speed + "Km/h";
    span.innerHTML = "";
    switch (data.weather[0].main) {
      case "Clouds":
        cloudImg.src = "images/clouds.png";
        break;
      case "Clear":
        cloudImg.src = "images/clear.png";
        break;
      case "Rain":
        cloudImg.src = "images/rain.png";
        break;
      case "Drizzle":
        cloudImg.src = "images/drizzle.png";
        break;
      case "Mist":
        cloudImg.src = "images/mist.png";
        break;
      default:
        // Handle other cases or provide a default image
        break;
    }
  }
  console.log(data);
}
async function fetchWeather(city) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
  )
    .then((res) => {
      let data = res.json();
      city = cityInput.value;
      return data;
    })
    .then(async (res) => {
      dsiplayData(res);
      await hideLoadingAnimation();
      babckgroundImage();
    })
    .catch((err) => {
      console.log(Error(err));
      hideLoadingAnimation();
    });
}
let currentLocationBtn = document.getElementById("current-location");
currentLocationBtn.addEventListener("click", getWeatherForCurrentLocation);

// Function to fetch weather based on user's current location
function getWeatherForCurrentLocation() {
  if (navigator.geolocation) {
    showLoadingAnimation();

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        fetchWeatherByCoordinates(latitude, longitude);
      },
      (error) => {
        console.error("Error getting current location:", error);
        hideLoadingAnimation();
      }
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
  }
}
function fetchWeatherByCoordinates(latitude, longitude) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
  fetch(apiUrl)
    .then((res) => res.json())
    .then((data) => {
      // Process and update UI with weather data
      dsiplayData(data);
      hideLoadingAnimation();
      babckgroundImage();
    })
    .catch((err) => {
      console.error("Error fetching weather data:", err);
      hideLoadingAnimation();
    });
}
