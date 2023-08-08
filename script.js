function getCoordinates(cityName, openWeatherApiKey) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=21a851c31586709dc1d2d9f3f4e0f188`;
  
    return fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        if (data.coord) {
          return data.coord;
        } else {
          throw new Error('City not found');
        }
      });
  }
  
  function fetchWeatherData(cityName) {
    const openWeatherApiKey = '21a851c31586709dc1d2d9f3f4e0f188';
    
    getCoordinates(cityName, openWeatherApiKey)
      .then(location => {
        const lat = location.lat;
        const lon = location.lon;
  
        const apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely&appid=21a851c31586709dc1d2d9f3f4e0f188`;
  
        fetch(apiUrl)
          .then(response => response.json())
          .then(data => {
          })
          .catch(error => {
            console.error('Error fetching weather data:', error);
          });
      })
      .catch(error => {
        console.error('Error getting coordinates:', error);
      });
  }
  
  function updateSearchHistory(cityName) {
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    searchHistory.push(cityName);
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }
  
  const searchButton = document.getElementById('search-button');
  searchButton.addEventListener('click', () => {
    const cityName = document.getElementById('city-input').value;
    fetchWeatherData(cityName);
  });
  
  function displaySearchHistory(history) {
    const searchHistoryList = document.getElementById('search-history');
    searchHistoryList.innerHTML = '';
  
    history.forEach(city => {
      const listItem = document.createElement('li');
      listItem.textContent = city;
      listItem.addEventListener('click', () => {
        fetchWeatherData(city);
      });
      searchHistoryList.appendChild(listItem);
    });
  }
  
  const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
  displaySearchHistory(searchHistory);