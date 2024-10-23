// const access_key = 'ab668de2367deb17548466790b816817';
const weatherAPIKey = '17cd4a58c8db541af2808d42a71e58b4';

window.addEventListener("load", async function () {
  const params = new URLSearchParams(window.location.search);
  const origin = params.get("origin");
  const destination = params.get("destination");
  const departDate = params.get("departDate");
  const returnDate = params.get("returnDate");
  

  // First API that gives original sky, destination, date of travel and return, and the prices from AVIATIONSTACK.\
  const displayFlightInfo = (flightData) => {
    const flightDetailsElement = document.getElementById("flightDetails");
    
    flightDetailsElement.innerHTML = flightData.map(flight => `
      <div class="flight-item">
        <div class="flight-times">
          <div class="time">
            ${flight.departure.scheduled ? new Date(flight.departure.scheduled).toLocaleTimeString() : 'Unknown'} 
            - 
            ${flight.arrival.scheduled ? new Date(flight.arrival.scheduled).toLocaleTimeString() : 'Unknown'}
          </div>
          <div class="duration">${flight.flight_status} on ${flight.flight_date}</div>
        </div>
        <div class="flight-route">
          ${flight.departure.airport || 'Unknown Airport'} (${flight.departure.iata || 'Unknown IATA'}) 
          - 
          ${flight.arrival.airport || 'Unknown Airport'} (${flight.arrival.iata || 'Unknown IATA'})
        </div>
        <div class="flight-airlines">
          <i class="fas fa-plane"></i> ${flight.airline.name || 'Unknown Airline'}
        </div>
        <div class="flight-details">
          Departure at: ${flight.departure.scheduled ? new Date(flight.departure.scheduled).toLocaleString() : 'Unknown'} 
          <br>
          Arrival at: ${flight.arrival.scheduled ? new Date(flight.arrival.scheduled).toLocaleString() : 'Unknown'}
        </div>
      </div>
    `).join('');
  };
  
  const fetchFlightInfo = async () => {
    const baseURL = "http://api.aviationstack.com/v1/flights";
    const params = new URLSearchParams();
    params.append("access_key", access_key);
    const limit = 100;
    params.append("limit", limit.toString());

    const url = new URL(baseURL);
    url.search = params.toString();
    const options = {
      method: "GET",
    };
    try {
      const response = await fetch(url, options);
      const data = await response.json();

      console.log("Flight Data:", data);

      if (data && data.data) {
        displayFlightInfo(data.data.slice(0, limit));
      } else {
        console.error("Invalid flight data structure:", data);
        const flightDetailsElement = document.getElementById("flightDetails");
        flightDetailsElement.innerHTML =
          "<p>Sorry, there is no available flights.</p>";
      }
    } catch (error) {
      console.error("Error fetching flight data:", error);
      const flightDetailsElement = document.getElementById("flightDetails");
      flightDetailsElement.innerHTML =
        "<p>Error fetching flight information.</p>";
    }
  };
  // Second API that displays the weather from Open Weather.
  const displayWeatherInfo = (weatherData) => {
    const weatherDetailsElement = document.getElementById("weatherDetails");
  
    weatherDetailsElement.innerHTML = `
      <div class="weather-item">
        <h3>Weather in ${weatherData.name}, ${weatherData.sys.country}</h3>
        <div class="weather-times">
          <div class="temp">Temperature: ${weatherData.main.temp}°F</div>
          <div class="feels-like">Feels Like: ${weatherData.main.feels_like}°F</div>
        </div>
        <div class="weather-description">
          ${weatherData.weather[0].description} (${weatherData.weather[0].main})
        </div>
        <div class="weather-details">
          Humidity: ${weatherData.main.humidity}% <br>
          Wind Speed: ${weatherData.wind.speed} m/s <br>
          Visibility: ${weatherData.visibility} meters
        </div>
      </div>
    `;
  };
  

  const fetchWeatherInfo = async (destination) => {
    const url2 = `https://open-weather13.p.rapidapi.com/city/${destination}/EN`;
    const options2 = {
      method: "GET",
      headers: {
        "x-rapidapi-key": weatherAPIKey,
        "x-rapidapi-host": "open-weather13.p.rapidapi.com",
      },
    };
    try {
      const response = await fetch(url2, options2);
      const data = await response.json();
      console.log("Weather Data:", data);

      if (data && data.name && data.main && data.weather) {
        displayWeatherInfo(data);
      } else {
        console.error("Invalid weather data structure:", data);
        const weatherDetailsElement = document.getElementById("weatherDetails");
        weatherDetailsElement.innerHTML =
          "<p>No weather information available.</p>";
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
      const weatherDetailsElement = document.getElementById("weatherDetails");
      weatherDetailsElement.innerHTML 
        "<p>Error fetching weather information.</p>";
    }
  };
  fetchFlightInfo();
  fetchWeatherInfo(destination);
});


document.getElementById('bookingForm').addEventListener('submit', function(event) {
  event.preventDefault();  // Prevent default form submission
  
  // Get the form values
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const flight = document.getElementById('flight').value;
  
  // Construct the mailto link
  const mailtoLink = `mailto:mameami26@gmail.com?subject=Flight Booking&body=
    Name: ${encodeURIComponent(name)}%0A
    Email: ${encodeURIComponent(email)}%0A
    Phone: ${encodeURIComponent(phone)}%0A
    Flight: ${encodeURIComponent(flight)}`;
    
  // Open the mail client with the constructed mailto link
  window.location.href = mailtoLink;
});