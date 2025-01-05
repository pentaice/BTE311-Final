import React, { useState, useEffect, useCallback } from "react";
import "./App.css";

function App() {
  const [city, setCity] = useState("Çankaya"); // İlk şehir olarak Çankaya
  const [inputCity, setInputCity] = useState("Çankaya");
  const [weatherData, setWeatherData] = useState(null);

  // Hava durumu verisini almak için fetchWeather fonksiyonu
  const fetchWeather = useCallback(async () => {
    const apiKey = "899c0c2c03888f87600997b4fa32c5ed"; // API anahtarı
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
  }, [city]); // 'city' değiştiğinde fetchWeather fonksiyonu yeniden oluşturulacak

  // Sayfa ilk yüklendiğinde Çankaya'nın hava durumu verisini
  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]); // fetchWeather fonksiyonu bağımlılık

  // Arka plan resmi
  const getBackgroundImage = () => {
    if (!weatherData || !weatherData.weather || !weatherData.weather[0]) {
      return ""; // Veriler gelmeden boş bırak
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
    setCity(inputCity); // inputCity'yi asıl city'e aktar ve güncelle
  };

  // Hızlı şehir seçimi için
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
              value={inputCity} // inputCity'i kontrol eder
              onChange={handleCityChange}
          />
          <button onClick={handleUpdate}>Güncelle</button>

          {/*Şehir Butonları*/}
          <div className="city-buttons">
            <button onClick={() => handleQuickCitySelect("Istanbul")}>İstanbul</button>
            <button onClick={() => handleQuickCitySelect("Ankara")}>Ankara</button>
            <button onClick={() => handleQuickCitySelect("Izmir")}>İzmir</button>
            <button onClick={() => handleQuickCitySelect("Antalya")}>Antalya</button>
          </div>

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
