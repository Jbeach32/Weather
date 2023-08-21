const apiKey = "d0876e9eb0e5798a352a5482cd26bd73";
const currentweatherapi =
  "https://api.openweathermap.org/data/3.0/onecall?lat=39.7392&lon=-104.9847&=imperial&appid=d0876e9eb0e5798a352a5482cd26bd73";
const baseURL = "https://api.openweathermap.org/data/2.5/weather?"
const cityForm = document.getElementById("city-form");
const cityInput = document.getElementById("city-input");
const currentWeatherSection = document.getElementById("current-weather");
const forecastSection = document.getElementById("forecast");

function kelvinToFahrenheit(kelvin) {
  return Math.floor((kelvin - 273.15) * 9 / 5 + 32);
}

function createAndAppendElement(tag, text, parent) {
  const element = document.createElement(tag);
  element.textContent = text;
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

cityForm.addEventListener("submit", async function (event) {
  event.preventDefault();
  const city = cityInput.value;

  const lonAndLat = await getLonAndLat(city)
  const lon = lonAndLat.lon
  const lat = lonAndLat.lat

  fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&=imperial&appid=${apiKey}`)
    .then((response) => response.json())
    .then((data) => {
        console.log(data)
      const kelvin = data.current.temp;
      const fahrenheit = kelvinToFahrenheit(kelvin);

      createAndAppendElement("h3", fahrenheit, currentWeatherSection);

      for (let i = 0; i < data.daily.length-3; i++) {
        const day = data.daily[i];
        const unixTimeStamp = day.dt;
        const kelvinDay = day.temp.day;
        const fahrenheitDay = kelvinToFahrenheit(kelvinDay);

        const date = new Date(unixTimeStamp * 1000);
        const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

        createAndAppendElement("h3", `Day ${i + 1}`, forecastSection);
        createAndAppendElement("h3", formattedDate, forecastSection);
        createAndAppendElement("h3", fahrenheitDay, forecastSection);
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
});