import React from 'react';

interface WeatherCardProps {
  city: string;
  temperature: number;
  condition: string;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ city, temperature, condition }) => {
  return (
    <div className="weather-card">
      <h3>{city}</h3>
      <p>Temperatur: {temperature}°C</p>
      <p>Bedingung: {condition}</p>
    </div>
  );
};

export default WeatherCard;
