import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

// WeatherApp component definition
const WeatherApp = () => {
  // State variables for city input, weather data, and error messages
  const [cityName, setCityName] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Function to fetch weather data based on city name
  const fetchWeather = async () => {
    // Get API key from environment variables
    const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
    const endpoint = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${cityName}`;

    try {
      // Request weather data from the API
      const response = await fetch(endpoint);
      if (!response.ok) {
        // Handle network errors
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      // Check for API-specific errors in the response
      if (data.error) {
        throw new Error(data.error.message);
      }

      // Validate the location returned by the API
      if (data.location.name.toLowerCase() !== cityName.toLowerCase()) {
        throw new Error("Location does not match the input");
      }

      // Update state with the fetched weather data
      setWeatherData(data);
      setErrorMsg("");
    } catch (error) {
      // Handle errors and update state accordingly
      setWeatherData(null);
      setErrorMsg("Error fetching weather data: " + error.message);
      console.error("Error fetching weather data:", error);
    }
  };

  // Function to fetch weather data using geolocation coordinates
  const fetchWeatherByCoords = async (latitude, longitude) => {
    // Get API key from environment variables
    const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
    const endpoint = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${latitude},${longitude}`;

    try {
      // Request weather data from the API
      const response = await fetch(endpoint);
      if (!response.ok) {
        // Handle network errors
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      // Check for API-specific errors in the response
      if (data.error) {
        throw new Error(data.error.message);
      }

      // Update state with the fetched weather data
      setWeatherData(data);
      setErrorMsg("");
    } catch (error) {
      // Handle errors and update state accordingly
      setWeatherData(null);
      setErrorMsg("Error fetching weather data: " + error.message);
      console.error("Error fetching weather data:", error);
    }
  };

  // Effect to fetch weather data based on user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByCoords(latitude, longitude);
        },
        (error) => {
          setErrorMsg("Error fetching location");
          console.error("Error getting geolocation:", error);
        }
      );
    }
  }, []); // Runs once when the component mounts

  // Handle form submission to fetch weather data for entered city
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (cityName.trim()) {
      fetchWeather();
    } else {
      setErrorMsg("Please enter a city name");
      setWeatherData(null);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">Weather App</h1>
      {/* Form to submit city name */}
      <form
        onSubmit={handleFormSubmit}
        className="d-flex justify-content-center align-items-center mt-3"
      >
        <input
          type="text"
          className="form-control me-2 w-50"
          placeholder="Enter city"
          value={cityName}
          onChange={(e) => setCityName(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">
          Get Weather
        </button>
      </form>
      {/* Display error message if there is an error */}
      {errorMsg && <div className="alert alert-danger mt-3">{errorMsg}</div>}
      {/* Display weather data if available */}
      {weatherData && (
        <div className="mt-4 text-center">
          <h2>
            {weatherData.location.name}, {weatherData.location.country}
          </h2>
          <p>{weatherData.current.condition.text}</p>
          <img
            src={weatherData.current.condition.icon}
            alt={weatherData.current.condition.text}
          />
          <h3>{weatherData.current.temp_c}°C</h3>
        </div>
      )}
    </div>
  );
};

export default WeatherApp;
