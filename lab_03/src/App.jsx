import { useState, useEffect } from 'react';
import { fetchWeather } from './api/fetchWeather.js';
import './App.css';
function App() {
const [query, setQuery] = useState('');
const [weather, setWeather] = useState(null);
const [error, setError] = useState('');
const [loading, setLoading] = useState(false);
const [isOnline, setIsOnline] = useState(true);
useEffect(() => {
  setIsOnline(navigator.onLine);
  const handleOnline = () => setIsOnline(true);
  const handleOffline = () => setIsOnline(false);
  window.addEventListener("online",handleOnline);
  window.addEventListener("offline",handleOffline);

  return () => {
    window.removeEventListener("online", handleOnline);
    window.removeEventListener("offline", handleOffline);
  };
})
const search = async (e) => {
e.preventDefault();
if (!query.trim()) return; // puste pole - nic nie robimy
setLoading(true);
setError('');
try {
const data = await fetchWeather(query);
setWeather(data);
setQuery(''); // czyścimy pole po udanym wyszukiwaniu
} catch (err) {
setWeather(null);
setError(err.message);
} finally {
setLoading(false);
}
};
return (
<div className="main-container">
<form onSubmit={search}>
<input
type="text"
className="search"
placeholder="Wpisz miasto..."
value={query}
onChange={(e) => setQuery(e.target.value)}
/>
</form>
{!isOnline && <p className="message error">Brak połączenia {weather && <span>, pokazuje ostatnio pobrane dane</span>}</p>}
{loading && <p className="message">Pobieranie danych...</p>}
{isOnline && error && <p className="message error">{error}</p>}
{weather && (
<div className="city">
<h2 className="city-name">
<span>{weather.name}</span>
<sup>{weather.sys.country}</sup>
</h2>
<h1 className="city-temp">
<span>{Math.round(weather.main.temp)}&deg;C</span>
</h1>
<div className="info">
<img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} className="city-icon" alt={weather.weather[0].description}/>
<p>{weather.weather[0].description}</p>
<p>Ciśnienie: {weather.main.pressure} hPa</p>
<p>Wilgotność: {weather.main.humidity} %</p>
<p>Prędkość wiatru: {weather.wind.speed} m/s {weather.wind.gust && <span> w porywach do {weather.wind.gust} m/s</span>}</p>
<p>Kierunek wiatru: {weather.wind.deg} &deg;</p>
</div>
{weather.dt && <p class="czas">Dane z godziny {new Date(weather.dt * 1000).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}</p>}
</div>
)}
</div>
);
}
export default App;