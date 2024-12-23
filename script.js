// Event listener for search button
document.querySelector('.search-btn').addEventListener('click', getWeather);

// Event listener for input in the search box
document.querySelector('#city').addEventListener('input', fetchCitySuggestions);

// Function to fetch weather data for the searched city
async function getWeather() {
    const city = document.querySelector('#city').value.trim();
    const apiKey = 'e1127672fa72525b546d213598e6f9a3'; // Replace with your OpenWeatherMap API key
    const baseUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    if (!city) {
        alert('Please enter a city name.');
        return;
    }

    try {
        const response = await fetch(baseUrl);
        const data = await response.json();

        if (data.cod === 200) {
            updateUI(data);
        } else {
            alert('City not found. Please try again.');
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Failed to fetch weather data. Please try again later.');
    }
}

// Function to update the UI with fetched weather data
function updateUI(data) {
    const cityName = document.querySelector('#cityName');
    const temp = document.querySelector('#temp');
    const description = document.querySelector('#description');
    const icon = document.querySelector('#icon');
    const humidity = document.querySelector('#humidity');
    const windSpeed = document.querySelector('#windSpeed');
    const uvIndex = document.querySelector('#uvIndex');
    const visibility = document.querySelector('#visibility');

    cityName.textContent = `${data.name}, ${data.sys.country}`;
    temp.textContent = `${Math.round(data.main.temp)}°C`;
    description.textContent = capitalizeFirstLetter(data.weather[0].description);
    icon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    humidity.textContent = `Humidity: ${data.main.humidity}%`;
    windSpeed.textContent = `Wind: ${Math.round(data.wind.speed * 3.6)} km/h`; // Convert m/s to km/h
    visibility.textContent = `Visibility: ${(data.visibility / 1000).toFixed(1)} km`;

    fetchUVIndex(data.coord.lat, data.coord.lon, uvIndex);
}

// Fetch UV Index using latitude and longitude
async function fetchUVIndex(lat, lon, uvIndexElement) {
    const apiKey = 'e1127672fa72525b546d213598e6f9a3'; // Replace with your OpenWeatherMap API key
    const uvUrl = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    try {
        const response = await fetch(uvUrl);
        const data = await response.json();

        uvIndexElement.textContent = `UV Index: ${data.value}`;
    } catch (error) {
        console.error('Error fetching UV index:', error);
        uvIndexElement.textContent = 'UV Index: --';
    }
}

// Fetch city suggestions based on input
async function fetchCitySuggestions() {
    const query = document.querySelector('#city').value.trim();
    const suggestionBox = document.querySelector('.suggestion-box');

    if (query.length < 2) {
        suggestionBox.innerHTML = '';
        return;
    }

    const apiKey = 'YOUR_GEODB_API_KEY'; // Replace with your GeoDB API key
    const apiUrl = `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${query}&limit=5`;

    try {
        const response = await fetch(apiUrl, {
            headers: {
                'X-RapidAPI-Key': apiKey,
                'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
            }
        });
        const data = await response.json();

        const cities = data.data || [];
        suggestionBox.innerHTML = cities
            .map(city => `<div class="suggestion">${city.name}, ${city.country}</div>`)
            .join('');
    } catch (error) {
        console.error('Error fetching city suggestions:', error);
        suggestionBox.innerHTML = '<div class="suggestion">No suggestions available</div>';
    }
}

// Fill the search box when a suggestion is clicked
document.querySelector('.suggestion-box').addEventListener('click', (e) => {
    if (e.target.classList.contains('suggestion')) {
        document.querySelector('#city').value = e.target.textContent;
        document.querySelector('.suggestion-box').innerHTML = ''; // Clear suggestions
    }
});

// Utility function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
