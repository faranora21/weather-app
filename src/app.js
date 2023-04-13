function dateTime() {
  let date = new Date();
  let day = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let currentDay = day[date.getDay()];
  let currentHour = date.getHours();
  let currentMinute = date.getMinutes();
  if (currentMinute < 10) {
    currentMinute = "0" + currentMinute;
  }

  let today = `${currentDay}, ${currentHour}:${currentMinute}`;
  return today;
}

let todayTime = document.querySelector("#todayTime");
todayTime.innerHTML = dateTime();

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `<div class="col-2 weekday"> <div class="weather-forecast-date">${formatDay(
          forecastDay.dt
        )}</div><img
                  src="http://openweathermap.org/img/wn/${
                    forecastDay.weather[0].icon
                  }@2x.png"
                  alt=""
                  width="42"
                /><div class="weather-forecast-temperatures">
                 <span class="weather-forecast-temperature-max"> ${Math.round(
                   forecastDay.temp.max
                 )}°</span>
                  <span class="weather-forecast-temperature-min"> ${Math.round(
                    forecastDay.temp.min
                  )}°</span> </div></div>`;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "8cd9be374c7c96c39a9fe73f4bf2f055";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then((response) => {
    displayForecast(response);
  });
}

function displayWeatherCondition(response) {
  document.querySelector("#city").innerHTML = response.data.name;
  celsiusTemperature = response.data.main.temp;
  console.log(celsiusTemperature);
  console.log(response.data);
  document.querySelector(".num").innerHTML = Math.round(celsiusTemperature);
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#description").innerHTML =
    response.data.weather[0].description;
  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);

  getForecast(response.data.coord);
}

function searchCity(city) {
  let apiKey = "8cd9be374c7c96c39a9fe73f4bf2f055";
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then((response) => displayWeatherCondition(response));
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#searchInput").value;
  console.log(city);
  searchCity(city);
}

let searchForm = document.querySelector("#searchForm");
searchForm.addEventListener("submit", handleSubmit);

function searchLocation(position) {
  let apiKey = "8cd9be374c7c96c39a9fe73f4bf2f055";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric&appid=${apiKey}`;
  axios.get(apiUrl).then((response) => {
    displayWeatherCondition(response);
  });
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

searchForm.addEventListener("submit", handleSubmit);

let currentLocationButton = document.querySelector(".current-button");
currentLocationButton.addEventListener("click", getCurrentLocation);

searchCity("Johor Bahru");

function convertF() {
  let tem = document.querySelector(".num");
  if (tem.classList.contains("cels")) {
    let temp = tem.innerHTML;
    tem.innerHTML = Math.round(temp * 1.8 + 32);
    tem.classList.remove("cels");
    tem.classList.add("fare");
  }
}

function convertC() {
  let tem = document.querySelector(".num");
  if (tem.classList.contains("fare")) {
    let temp = tem.innerHTML;
    tem.innerHTML = Math.round((temp - 32) / 1.8);
    tem.classList.remove("fare");
    tem.classList.add("cels");
  }
}

let farenheit = document.querySelector("#far");
farenheit.addEventListener("click", convertF);

let celcius = document.querySelector("#cel");
celcius.addEventListener("click", convertC);
