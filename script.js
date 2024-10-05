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

    // Show map with iframe
    const apiKey = 'YOUR_GOOGLE_MAPS_API_KEY'; // Replace with your Google Maps API key
    const mapSrc = `https://www.google.com/maps/embed/v1/view?key=${apiKey}&center=${lat},${lon}&zoom=15&markers=${lat},${lon}`;
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

// Fetch weather data using OpenWeatherMap One Call API?
function fetchWeatherData(lat, lon) {
    
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=22&longitude=79&hourly=temperature_2m&timezone=auto`;    

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
    const weather = data.current;

    document.getElementById('location').textContent = "Your Location"; 
    document.getElementById('windSpeed').textContent = `${weather.wind_speed} km/h`;
    document.getElementById('humidity').textContent = `${weather.humidity}%`;
    document.getElementById('timezone').textContent = data.timezone;
    document.getElementById('pressure').textContent = `${weather.pressure} hPa`;
    document.getElementById('windDirection').textContent = getWindDirection(weather.wind_deg);
    document.getElementById('uvIndex').textContent = weather.uvi;
    document.getElementById('feelsLike').textContent = `${weather.feels_like}°C`;

    document.getElementById('weatherData').style.display = 'block';
}

// Convert wind degree to compass direction
function getWindDirection(degree) {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degree / 45) % 8;
    return directions[index];
}
