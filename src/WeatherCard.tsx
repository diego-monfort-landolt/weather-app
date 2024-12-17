import React from 'react';
import { getWeatherCondition } from './utils/weatherConditions';

interface WeatherCardProps {
  city: string;
  temperature: number;
  condition: number;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ city, temperature, condition }) => {
  return (
    <div className="weather-card">
      <h3>{city}</h3>
      <p>Temperatura: {temperature}°C</p>
      <p>Condición: {getWeatherCondition(condition)}</p>
    </div>
  );
};

export default WeatherCard;
