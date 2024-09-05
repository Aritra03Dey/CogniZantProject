

const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");
const api = "d9ce457743a341580fb9788013b77afc";
const cache = {};

weatherForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevent page refresh

  const city = cityInput.value.trim(); // Trim whitespace from input

  if (city) {
    try {
      const weatherData = await getWeatherData(city); // Wait until the promise is resolved
      displayWeatherInfo(weatherData);
    } catch (error) {
      displayError("An error occurred while fetching the weather data.");
    }
  } else {
    displayError("Please enter a city!");
  }
});

async function getWeatherData(city) {
  // Check if the data is already in the cache and is recent (within the last 10 minutes)
  if (cache[city] && Date.now() - cache[city].timestamp < 10 * 60 * 1000) {
    return cache[city].data;
  }

  const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api}`;
  const response = await fetch(apiURL);

  if (!response.ok) {
    throw new Error("Could not fetch weather data");
  }

  const data = await response.json();

  // Cache the new data with a timestamp
  cache[city] = {
    data: data,
    timestamp: Date.now(),
  };

  return data;
}

function displayWeatherInfo(data) {
  const {
    name: city,
    main: { temp, humidity },
    weather: [{ description, id }],
  } = data; // Destructure the data for easier access

  card.textContent = ""; // Clear previous content
  card.style.display = "flex";

  const cityDisplay = document.createElement("h1");
  const tempDisplay = document.createElement("p");
  const humidityDisplay = document.createElement("p");
  const descDisplay = document.createElement("p");
  const weatherEmoji = document.createElement("p");

  cityDisplay.textContent = city;
  tempDisplay.textContent = `${(temp - 273.15).toFixed(1)}°C`; // Convert temperature to Celsius
  humidityDisplay.textContent = `Humidity: ${humidity}%`;
  descDisplay.textContent = description;
  weatherEmoji.textContent = getWeatherEmoji(id);

  cityDisplay.classList.add("cityDisplay");
  tempDisplay.classList.add("tempDisplay");
  humidityDisplay.classList.add("humidityDisplay");
  descDisplay.classList.add("descDisplay");
  weatherEmoji.classList.add("weatherEmoji");

  card.appendChild(cityDisplay);
  card.appendChild(tempDisplay);
  card.appendChild(humidityDisplay);
  card.appendChild(descDisplay);
  card.appendChild(weatherEmoji);
}

function getWeatherEmoji(weatherId) {
  switch (true) {
    case weatherId >= 200 && weatherId < 300:
      return "⚡"; // Thunderstorm
    case weatherId >= 300 && weatherId < 400:
      return "🌦️"; // Drizzle
    case weatherId >= 500 && weatherId < 600:
      return "🌧️"; // Rain
    case weatherId >= 600 && weatherId < 700:
      return "⛄"; // Snow
    case weatherId >= 700 && weatherId < 800:
      return "💨"; // Atmosphere (mist, smoke, etc.)
    case weatherId === 800:
      return "🌞"; // Clear
    case weatherId >= 801 && weatherId < 810:
      return "⛅"; // Clouds
    default:
      return "❓"; // Unknown weather
  }
}

function displayError(message) {
  const errorDisplay = document.createElement("p");
  errorDisplay.textContent = message;
  errorDisplay.classList.add("errorDisplay");

  card.textContent = "";
  card.style.display = "flex";
  card.appendChild(errorDisplay);
}

