const apiKey = "d0876e9eb0e5798a352a5482cd26bd73";
const currentweatherapi =
  "https://api.openweathermap.org/data/3.0/onecall?lat=39.7392&lon=-104.9847&=imperial&appid=d0876e9eb0e5798a352a5482cd26bd73";
const baseURL = "https://api.openweathermap.org/data/2.5/weather?";
const cityForm = document.getElementById("city-form");
const cityInput = document.getElementById("city-input");
const currentWeatherSection = document.getElementById("current-weather");
const forecastSection = document.getElementById("forecast");

function kelvinToFahrenheit(kelvin) {
  return Math.floor(((kelvin - 273.15) * 9) / 5 + 32);
}



function createAndAppendElement(tag, text, parent) {
  const element = document.createElement(tag);
  if (tag === "img") {
    element.src = text;
  } else {
  element.textContent = text;
  }
  parent.appendChild(element);
}

async function getLonAndLat(city) {
  try {
    const response = await fetch(`${baseURL}q=${city}&appid=${apiKey}`);
    const data = await response.json();
    const lonAndLat = {
      lon: data.coord.lon,
      lat: data.coord.lat,
    };
    return lonAndLat;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

function addToLocalStorage(city) {
  let cities = localStorage.getItem("searchedCities");
  if (!cities) {
    cities = [];
  } else {
    cities = JSON.parse(cities);
  }

  if (!cities.includes(city)) {
    cities.push(city);
    localStorage.setItem("searchedCities", JSON.stringify(cities));
  }
}

async function getWeatherData(city) {
  const lonAndLat = await getLonAndLat(city);
  const lon = lonAndLat.lon;
  const lat = lonAndLat.lat;

  return fetch(
    `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&=imperial&appid=${apiKey}`
  ).then((response) => response.json());
}

function displayWeatherForCity(city) {
  try {
    getWeatherData(city)
      .then((data) => {
        currentWeatherSection.innerHTML = "";
        forecastSection.innerHTML = "";

        const cityName = data.name;
        createAndAppendElement("h2", cityName, currentWeatherSection);

        const currentUnixTimeStamp = data.current.dt;
        const currentDate = new Date(currentUnixTimeStamp * 1000);
        const formattedCurrentDate = `${
          currentDate.getMonth() + 1
        }/${currentDate.getDate()}/${currentDate.getFullYear()}`;
        createAndAppendElement(
          "p",
          formattedCurrentDate,
          currentWeatherSection
        );

        const currentWeatherIcon = `https://openweathermap.org/img/wn/${data.current.weather[0].icon}.png`;
        createAndAppendElement(
          "img",
          currentWeatherIcon,
          currentWeatherSection
        );

        const currentTemp = Math.round(data.current.temp);
        createAndAppendElement(
          "p",
          `Temperature: ${currentTemp}°F`,
          currentWeatherSection
        );

        const currentHumidity = data.current.humidity;
        createAndAppendElement(
          "p",
          `Humidity: ${currentHumidity}%`,
          currentWeatherSection
        );

        const currentWindSpeed = data.current.wind_speed;
        createAndAppendElement(
          "p",
          `Wind Speed: ${currentWindSpeed} mph`,
          currentWeatherSection
        );

        for (let i = 0; i < data.daily.length - 3; i++) {
          const day = data.daily[i];
          const unixTimeStamp = day.dt;
          const kelvinDay = day.temp.day;
          const fahrenheitDay = kelvinToFahrenheit(kelvinDay);

          const date = new Date(unixTimeStamp * 1000);
          const formattedDate = `${
            date.getMonth() + 1
          }/${date.getDate()}/${date.getFullYear()}`;

          createAndAppendElement("h3", `Day ${i + 1}`, forecastSection);
          createAndAppendElement("p", formattedDate, forecastSection);
          createAndAppendElement(
            "p",
            `Temperature: ${fahrenheitDay}°F`,
            forecastSection
          );
          createAndAppendElement(
            "p",
            `Humidity: ${day.humidity}%`,
            forecastSection
          );
          createAndAppendElement(
            "p",
            `Wind Speed: ${day.wind_speed} mph`,
            forecastSection
          );
        }
      })
      .catch((error) => {
        console.error("Error displaying weather data:", error);
      });
  } catch (error) {
    console.error("Error fetching city data:", error);
  }
}

cityForm.addEventListener("submit", async function (event) {
  event.preventDefault();
  const city = cityInput.value;

  try {
    const lonAndLat = await getLonAndLat(city);
    const lon = lonAndLat.lon;
    const lat = lonAndLat.lat;

    fetch(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&=imperial&appid=${apiKey}`
    )
      .then((response) => response.json())
      .then((weatherData) => {
        fetch(
          `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`
        )
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            currentWeatherSection.innerHTML = "";
            forecastSection.innerHTML = "";

            const cityName = weatherData.name;
            createAndAppendElement("h2", cityName, currentWeatherSection);

            const currentUnixTimeStamp = data.current.dt;
            const currentDate = new Date(currentUnixTimeStamp * 1000);
            const formattedCurrentDate = `${
              currentDate.getMonth() + 1
            }/${currentDate.getDate()}/${currentDate.getFullYear()}`;
            createAndAppendElement(
              "p",
              formattedCurrentDate,
              currentWeatherSection
            );

            const currentWeatherIcon = `https://openweathermap.org/img/wn/${data.current.weather[0].icon}.png`;
            createAndAppendElement(
              "img",
              currentWeatherIcon,
              currentWeatherSection
            );

            const currentTemp = Math.round(data.current.temp);
            createAndAppendElement(
              "p",
              `Temperature: ${currentTemp}°F`,
              currentWeatherSection
            );

            const currentHumidity = data.current.humidity;
            createAndAppendElement(
              "p",
              `Humidity: ${currentHumidity}%`,
              currentWeatherSection
            );

            const currentWindSpeed = data.current.wind_speed;
            createAndAppendElement(
              "p",
              `Wind Speed: ${currentWindSpeed} mph`,
              currentWeatherSection
            );

            for (let i = 0; i < data.daily.length - 3; i++) {
              const day = data.daily[i];
              const unixTimeStamp = day.dt;
              const kelvinDay = day.temp.day;
              const fahrenheitDay = kelvinToFahrenheit(kelvinDay);

              const date = new Date(unixTimeStamp * 1000);
              const formattedDate = `${
                date.getMonth() + 1
              }/${date.getDate()}/${date.getFullYear()}`;

              createAndAppendElement("h3", `Day ${i + 1}`, forecastSection);
              createAndAppendElement("p", formattedDate, forecastSection);
              createAndAppendElement(
                "p",
                `Temperature: ${fahrenheitDay}°F`,
                forecastSection
              );
              createAndAppendElement(
                "p",
                `Humidity: ${day.humidity}%`,
                forecastSection
              );
              createAndAppendElement(
                "p",
                `Wind Speed: ${day.wind_speed} mph`,
                forecastSection
              );
            }
            addToLocalStorage(city);
            displayWeatherForCity(city);
          })
          .catch((error) => {
            console.error("Error fetching weather data:", error);
          });
      });
  } catch (error) {
    console.error("Error fetching city data:", error);
  }
});

window.addEventListener("load", function () {
  const cities = JSON.parse(localStorage.getItem("searchedCities")) || [];
  const cityList = document.getElementById("city-list");

  cities.forEach((city) => {
    const cityItem = document.createElement("li");
    cityItem.textContent = city;
    cityItem.addEventListener("click", () => {
      displayWeatherForCity(city);
    });
    cityList.appendChild(cityItem);
  });
});
