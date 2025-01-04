import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [city, setCity] = useState("Çankaya"); // İlk şehir olarak Çankaya
  const [weatherData, setWeatherData] = useState(null);

  // Hava durumu verisini almak için fetchWeather fonksiyonu
  const fetchWeather = async () => {
    const apiKey = "899c0c2c03888f87600997b4fa32c5ed"; // API anahtarınız
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      // Eğer API hata dönerse, veriyi kontrol et
      if (data.cod !== 200) {
        alert("Geçersiz şehir adı, lütfen tekrar deneyin.");
        setWeatherData(null); // Veriyi sıfırla
        return;
      }

      setWeatherData(data); // Veriyi güncelle
    } catch (error) {
      console.error("Hava durumu alınamadı:", error);
      alert("Bir hata oluştu, lütfen tekrar deneyin.");
    }
  };

  // Sayfa ilk yüklendiğinde Çankaya'nın hava durumu verisini çek
  useEffect(() => {
    fetchWeather();
  }, []); // Boş bağımlılık dizisi, sadece ilk renderda çalışacak

  // Arka plan resmini seçen fonksiyon
  const getBackgroundImage = () => {
    if (!weatherData || !weatherData.weather || !weatherData.weather[0]) {
      return ""; // Veriler gelmeden boş bırak
    }

    const weatherMain = weatherData.weather[0].main;

    switch (weatherMain) {
      case "Clear":
        return `${process.env.PUBLIC_URL}/clear.jpeg`; // Güneşli hava
      case "Rain":
        return `${process.env.PUBLIC_URL}/rain.jpeg`; // Yağmurlu hava
      case "Snow":
        return `${process.env.PUBLIC_URL}/snow.jpeg`; // Karlı hava
      case "Clouds":
        return `${process.env.PUBLIC_URL}/clouds.jpeg`; // Bulutlu hava
      default:
        return `${process.env.PUBLIC_URL}/default.jpeg`; // Diğer durumlar
    }
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
              value={city}
              onChange={(e) => setCity(e.target.value)}
          />
          <button onClick={fetchWeather}>Güncelle</button>

          {weatherData && (
              <div>
                <h2>{weatherData.name}</h2>
                <p>Sıcaklık: {weatherData.main.temp}°C</p>
                <p>Durum: {weatherData.weather[0].description}</p>
                <p>Nem: {weatherData.main.humidity}%</p>
                <p>Rüzgar Hızı: {weatherData.wind.speed} m/s</p>
              </div>
          )}
        </div>
      </div>
  );
}

export default App;
