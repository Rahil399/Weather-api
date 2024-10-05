document.getElementById('fetchDataBtn').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
});

// Show position on Google Maps and display latitude and longitude
function showPosition(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    // Show lat/long details
    document.getElementById('lat').textContent = lat;
    document.getElementById('lon').textContent = lon;
    document.getElementById('locationDetails').style.display = 'block';

    // Show map with iframe (using OpenStreetMap instead)
    const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${lon-0.01},${lat-0.01},${lon+0.01},${lat+0.01}&layer=mapnik&marker=${lat},${lon}`;
    document.getElementById('map').src = mapSrc; // Set the src attribute of the iframe
    document.getElementById('map').style.display = 'block'; // Make iframe visible

    // Show second page
    document.getElementById('firstPage').style.display = 'none';
    document.getElementById('secondPage').style.display = 'block';

    // Fetch weather data after showing map
    fetchWeatherData(lat, lon);
}

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}

// Fetch weather data using Open-Meteo
function fetchWeatherData(lat, lon) {
    // Use Open-Meteo's free API without an API key
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayWeatherData(data);
        })
        .catch(error => {
            console.error("Error fetching weather data: ", error);
        });
}

function displayWeatherData(data) {
    const weather = data.current_weather; // Updated to match Open-Meteo's response format

    document.getElementById('location').textContent = "Your Location"; 
    document.getElementById('windSpeed').textContent = `${weather.windspeed} km/h`;
    document.getElementById('humidity').textContent = `${weather.humidity || 'N/A'}%`; // Humidity might not be available
    document.getElementById('timezone').textContent = data.timezone;
    document.getElementById('pressure').textContent = `${weather.pressure} hPa`; // If available
    document.getElementById('windDirection').textContent = getWindDirection(weather.winddirection || 0);
    document.getElementById('uvIndex').textContent = weather.uv_index || 'N/A'; // UV index might not be available
    document.getElementById('feelsLike').textContent = `${weather.apparent_temperature || 'N/A'}°C`; // Feels like might not be available

    document.getElementById('weatherData').style.display = 'block';
}

// Convert wind degree to compass direction
function getWindDirection(degree) {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degree / 45) % 8;
    return directions[index];
}
