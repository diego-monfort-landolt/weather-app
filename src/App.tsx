import React, { useState, useEffect } from 'react';
import './App.css';

const App: React.FC = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState<any>(null);
  const [searchedCity, setSearchedCity] = useState('');
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    if (location) {
      fetchWeatherData(location.latitude, location.longitude);
    }
  }, [location]);

  const fetchWeatherData = async (latitude: number, longitude: number) => {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
    const data = await response.json();
    setWeatherData(data);
  };

  const fetchLocationName = async (latitude: number, longitude: number) => {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
    const data = await response.json();
    return data.address.city || data.address.town || data.address.village || 'Unknown location';
  };

  const handleLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        const locationName = await fetchLocationName(latitude, longitude);
        setSearchedCity(locationName); // Standortname setzen
      });
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value);
  };

  const handleCitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const geocodeResponse = await fetch(`https://nominatim.openstreetmap.org/search?city=${city}&format=json&limit=1`);
    const geocodeData = await geocodeResponse.json();
    if (geocodeData.length > 0) {
      const { lat, lon } = geocodeData[0];
      fetchWeatherData(parseFloat(lat), parseFloat(lon));
      setSearchedCity(city);
    } else {
      alert('City not found');
    }
  };

  const getWeatherClass = (weatherCode: number) => {
    if (weatherCode >= 0 && weatherCode < 3) return 'sunny';
    if (weatherCode >= 3 && weatherCode < 6) return 'cloudy';
    if (weatherCode >= 6 && weatherCode < 9) return 'rainy';
    // Weitere Wetterzustände hinzufügen
    return '';
  };

  return (
    <div className="App">
      <h1>Previsión meteorológica</h1>
      <form onSubmit={handleCitySubmit}>
        <input
          type="text"
          value={city}
          onChange={handleCityChange}
          placeholder="Ingrese ciudad"
        />
        <button type="submit">Obtener el clima</button>
      </form>
      <button onClick={handleLocation}>Usar ubicación actual</button>
      {weatherData && (
        <div className="weather-container">
          <div className={`weather-card ${getWeatherClass(weatherData.current_weather.weathercode)}`}>
            <h3>Clima en {searchedCity}</h3>
            <p>Temperatura: {weatherData.current_weather.temperature}°C</p>
            <p>Velocidad del viento: {weatherData.current_weather.windspeed} km/h</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;