import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [ weather, setWeather ] = useState({
    temp: '',
    desc: '',
    icon: ''
  });
  useEffect(() => {
    fetch('https://api.openweathermap.org/data/2.5/weather?q=Busan&units=Metric&APIkey=444353129dd297608ab43143b9cba9c5')
    .then(response => response.json())
    .then(result => {
      setWeather({
        temp: result.main.temp,
        desc: result.weather[0].description,
        icon: result.weather[0].icon
      })
    })
    .catch(error => console.log(error))
  }, []);

  if(weather.icon) {
    return (
      <>
        <p>기온 : {weather.temp}</p>
        <p>설명 : {weather.desc}</p>
        <img src={`http://openweathermap.org/img/wn/${weather.icon}@2x.png`} alt="날씨 아이콘" />
      </>
    );
  } else {
    return <div>Loading ....</div>
  }
}

export default App
