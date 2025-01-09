import React, { useState, useEffect, useCallback } from "react";
import "./App.css";

function App() {
  const [city, setCity] = useState("Çankaya");
  const [inputCity, setInputCity] = useState("Çankaya");
  const [weatherData, setWeatherData] = useState(null);
  const [cityTemps, setCityTemps] = useState({
    Istanbul: null,
    Ankara: null,
    Izmir: null,
    Antalya: null,
  });

  const fetchWeather = useCallback(async () => {
    const apiKey = "899c0c2c03888f87600997b4fa32c5ed";
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.cod !== 200) {
        alert("Geçersiz şehir adı, lütfen tekrar deneyin.");
        setWeatherData(null);
        return;
      }

      setWeatherData(data);
    } catch (error) {
      console.error("Hava durumu alınamadı:", error);
      alert("Bir hata oluştu, lütfen tekrar deneyin.");
    }
  }, [city]);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  useEffect(() => {
    // Function to update temperatures for each city
    const fetchCityTemps = async () => {
      const apiKey = "899c0c2c03888f87600997b4fa32c5ed";
      const cities = ["Istanbul", "Ankara", "Izmir", "Antalya"];
      const temps = {};

      for (let city of cities) {
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        try {
          const response = await fetch(apiUrl);
          const data = await response.json();
          if (data.cod === 200) {
            temps[city] = data.main.temp;
          }
        } catch (error) {
          console.error("Hava durumu alınamadı:", error);
        }
      }

      setCityTemps(temps);
    };

    fetchCityTemps();
  }, []);

  const getBackgroundImage = () => {
    if (!weatherData || !weatherData.weather || !weatherData.weather[0]) {
      return "";
    }

    const weatherMain = weatherData.weather[0].main;

    switch (weatherMain) {
      case "Clear":
        return `${process.env.PUBLIC_URL}/clear.jpeg`;
      case "Rain":
        return `${process.env.PUBLIC_URL}/rain.jpeg`;
      case "Snow":
        return `${process.env.PUBLIC_URL}/snow.jpeg`;
      case "Clouds":
        return `${process.env.PUBLIC_URL}/clouds.jpeg`;
      default:
        return `${process.env.PUBLIC_URL}/default.jpeg`;
    }
  };

  const handleCityChange = (e) => {
    setInputCity(e.target.value);
  };

  const handleUpdate = () => {
    setCity(inputCity);
  };

  const handleQuickCitySelect = (selectedCity) => {
    setCity(selectedCity);
  };

  return (
      <div
          className="App"
          style={{
            backgroundImage: `url(${getBackgroundImage()})`,
          }}
      >
        <div className="content">
          <h1>Hava Durumu</h1>
          <input
              type="text"
              placeholder="Şehir adı girin..."
              value={inputCity}
              onChange={handleCityChange}
          />
          <button onClick={handleUpdate}>Güncelle</button>

          <div className="city-buttons">
            <button onClick={() => handleQuickCitySelect("Istanbul")}>
              İstanbul {cityTemps.Istanbul ? `(${cityTemps.Istanbul}°C)` : "Yükleniyor..."}
            </button>
            <button onClick={() => handleQuickCitySelect("Ankara")}>
              Ankara {cityTemps.Ankara ? `(${cityTemps.Ankara}°C)` : "Yükleniyor..."}
            </button>
            <button onClick={() => handleQuickCitySelect("Izmir")}>
              İzmir {cityTemps.Izmir ? `(${cityTemps.Izmir}°C)` : "Yükleniyor..."}
            </button>
            <button onClick={() => handleQuickCitySelect("Antalya")}>
              Antalya {cityTemps.Antalya ? `(${cityTemps.Antalya}°C)` : "Yükleniyor..."}
            </button>
          </div>

          {weatherData && (
              <div>
                <h2>{weatherData.name}</h2>
                <p>
                  Sıcaklık: {weatherData.main.temp}°C
                </p>
                <p>Durum: {weatherData.weather[0].description}</p>
                <p>Nem: {weatherData.main.humidity}%</p>
                <p>Rüzgar Hızı: {weatherData.wind.speed} m/s</p>
              </div>
          )}
        </div>

        {/* Hakkında bölümü */}
        <footer className="footer">
          <p>Emre Akışık - 2220780001</p>
        </footer>
      </div>
  );
}

export default App;
