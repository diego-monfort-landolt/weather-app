import React, { useState, useEffect } from 'react';
import WeatherCard from './WeatherCard';
import './App.css';

const App: React.FC = () => {
  interface WeatherData {
    current_weather: {
      temperature: number;
      weathercode: number;
    };
  }

  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [city, setCity] = useState<string>('');
  const [searchedCity, setSearchedCity] = useState<string>(''); // Neuer Zustand für die gesuchte Stadt

  useEffect(() => {
    if (location) {
      fetchWeatherData(location.latitude, location.longitude);
    }
  }, [location]);

  const fetchWeatherData = async (latitude: number, longitude: number) => {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
    const data = await response.json();
    setWeatherData([data]);
  };

  const handleLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setSearchedCity(''); // Gesuchte Stadt zurücksetzen
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

  return (
    <div className="App">
      <h1>Previsión meteorológica</h1>
      <button onClick={handleLocation}>Ubicación</button>
      <form onSubmit={handleCitySubmit}>
        <input 
        type="text"
        value={city} 
        onChange={handleCityChange} 
        placeholder="Ciudad" 
        />

        <button type="submit">Buscar</button>
      </form>
      <div className="weather-container">
        {weatherData.map((data, index) => (
            <WeatherCard
            key={index}
            city={searchedCity || 'Situación actual'}
            temperature={data.current_weather.temperature}
            condition={data.current_weather.weathercode}
          />
         
          
        ))}
      </div>
    </div>
  );
};
export default App;
