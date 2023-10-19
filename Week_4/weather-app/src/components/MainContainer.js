import React, { useState, useEffect } from "react";
import "../styles/MainContainer.css"; // Import the CSS file for MainContainer

function MainContainer(props) {

  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [aqi, setAqi] = useState(null);

  const apiKey = "8e7265170a89aebc23b02e1c63a84f6a"; // Replace with your own API key

  useEffect(() => {
    if (props.selectedCity) {
      const { lat, lon } = props.selectedCity;

      // Fetch current weather
      fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`)
          .then(response => response.json())
          .then(data => setWeather(data));

      // Fetch 5-day forecast
      fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`)
          .then(response => response.json())
          .then(data => setForecast(data));

      // Fetch AQI
      fetch(`http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`)
          .then(response => response.json())
          .then(data => setAqi(data));
    }
  }, [props.selectedCity]);

  function formatDate(daysFromNow = 0) {
    let output = "";
    var date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    output += date.toLocaleString("en-US", { weekday: "long" }).toUpperCase();
    output += " " + date.getDate();
    return output;
  }

  /*
  STEP 1: IMPORTANT NOTICE!

  Before you start, ensure that both App.js and SideContainer.js are complete. The reason is MainContainer 
  is dependent on the city selected in SideContainer and managed in App.js. You need the data to flow from 
  App.js to MainContainer for the selected city before making an API call to fetch weather data.
  */


  /*
  STEP 2: Manage Weather Data with State.
  
  Just like how we managed city data in App.js, we need a mechanism to manage the weather data 
  for the selected city in this component. Use the 'useState' hook to create a state variable 
  (e.g., 'weather') and its corresponding setter function (e.g., 'setWeather'). The initial state can be 
  null or an empty object.
  */

  
  /*
  STEP 3: Fetch Weather Data When City Changes.
  
  Whenever the selected city (passed as a prop) changes, you should make an API call to fetch the 
  new weather data. For this, use the 'useEffect' hook.

  The 'useEffect' hook lets you perform side effects (like fetching data) in functional components. 
  Set the dependency array of the 'useEffect' to watch for changes in the city prop. When it changes, 
  make the API call.

  After fetching the data, use the 'setWeather' function from the 'useState' hook to set the weather data 
  in your state.
  */
  
  
  return (
    <div id="main-container">
      <div id="weather-container">
        {/* 
        STEP 4: Display Weather Data.
        
        With the fetched weather data stored in state, use conditional rendering (perhaps the ternary operator) 
        to display it here. Make sure to check if the 'weather' state has data before trying to access its 
        properties to avoid runtime errors. 

        Break down the data object and figure out what you want to display (e.g., temperature, weather description).
        This is a good section to play around with React components! Create your own - a good example could be a WeatherCard
        component that takes in props, and displays data for each day of the week.
        */}

        {weather && (
            <>
              <h2>{props.selectedCity.fullName}</h2>
              <img src={`icons/${weather.weather[0].icon}.svg`} alt={weather.weather[0].description} />
              <p>Temperature: {((weather.main.temp - 273.15) * 9 / 5 + 32).toFixed(2)}°F</p>
              <p>Weather: {weather.weather[0].description}</p>
            </>
        )}

        {forecast && (
            <>
              <h2>5-Day Forecast:</h2>
              {forecast.list.map((dayData, index) => {
                if (index % 8 === 0) {
                  return (
                      <div key={index}>
                        <strong>{formatDate(index / 8)}</strong>
                        <img src={`icons/${dayData.weather[0].icon}.svg`} alt={dayData.weather[0].description} />
                        <p>{((dayData.main.temp - 273.15) * 9 / 5 + 32).toFixed(2)}°F</p>
                      </div>
                  );
                }
                return null;
              })}
            </>
        )}

        {aqi && (
            <>
              <h3>Air Quality Index:</h3>
              <p>AQI: {aqi.list[0].main.aqi}</p>
              <p>PM2.5: {aqi.list[0].components.pm2_5} µg/m³</p>
              <p>PM10: {aqi.list[0].components.pm10} µg/m³</p>
            </>
        )}

      </div>
    </div>
  );
}


export default MainContainer;

