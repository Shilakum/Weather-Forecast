const cityInput=document.querySelector(".city-input");
const searchButton =document.querySelector(".search-btn");
const locationButton =document.querySelector(".location-btn");
const currentWeatherDiv =document.querySelector(".current-weather");
const weatherCardsDiv =document.querySelector(".weather-cards");

const API_KEY="d1604341e874dfb4be4fbde777b30c59";

const createWeatherCard=(cityName, weatherItem, index) =>{
    //console.log(weatherItem.weather[0].description);
    if(index ===0){
 return `<div class="details">
 <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]}) </h2>
 <h4>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
    <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
    <h4>Humidity: ${weatherItem.main.humidity}%</h4>
    <h4>Pressure: ${weatherItem.main.pressure}<h4>
</div>
<div class="icon">
 <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
 <h4>${weatherItem.weather[0].description}</h4>
</div>`;
    }else{
    return `<li class="card">
    <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
        <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather-icon">
    <h4>Tempe: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
    <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
    <h4>Humidity: ${weatherItem.main.humidity}%</h4>
    <h4>Pressure: ${weatherItem.main.pressure}<h4>
    </li>`;
}}
const getWeatherDetails=(cityName, latitude, longitude ) => {
const WEATHER_API_URL=`http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;

fetch(WEATHER_API_URL).then(response => response.json()).then(data => {
    //Filter the forecasts to get only one forecats per day
    const uniqueForecastDays=[];
    const fiveDaysForecast=data.list.filter(forecast => {
        const forecastDate=new Date(forecast.dt_txt).getDate();
        console.log(forecastDate);
        if(!uniqueForecastDays.includes(forecastDate)){
            return uniqueForecastDays.push(forecastDate);
        }
        
    });
    console.log(fiveDaysForecast);

    //Clearing previous weather data
    cityInput.value="";
    currentWeatherDiv.innerHTML = "";
    weatherCardsDiv.innerHTML = "";

   //Creating weather cards and adding them to the DOM
    fiveDaysForecast.forEach((weatherItem, index) => {
        const html=createWeatherCard(cityName, weatherItem, index);
        if(index === 0){
            currentWeatherDiv.insertAdjacentHTML("beforeend", html);

        }else{
        weatherCardsDiv.insertAdjacentHTML("beforeend", html);
        }
    });
}).catch(() => {
    alert("An error occurred while fetching the weather forecast!");

});
}
const getCityCoordinates = () =>{
    const cityName =cityInput.value.trim();
    if(cityName==="") return;
     const GEOCODING_API_URL =`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;
     
     fetch(GEOCODING_API_URL).then(response => response.json()).then(data =>{
        if(!data.length) return alert(`No coordinates found for ${cityName}`);
        const {name, lat, lon }=data[0];
        console.log(data[0]);
        getWeatherDetails(name, lat, lon );
     }).catch(() =>{
        alert("An error occurred while fetching the coordinates!");
     });
   }
    const getUserCoordinates = () => {
        navigator.geolocation.getCurrentPosition(
            position => {
                console.log(position);
                const {latitude,longitude}=position.coords;
                const REVERSE_GEOCODING_URL=`http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
                
                //Get city name from coordinates using reverse geocoding API
                fetch(REVERSE_GEOCODING_URL).then(response => response.json()).then(data =>{
                    const {name}=data[0];
                    getWeatherDetails(name, latitude, longitude);
                 }).catch(() =>{
                    alert("An error occurred while fetching the city!");
                 });
            },
            error => {
                if(error.code === error.PERMISSION_DENIED){
                    alert("Geolocation request denied. Please reset location permission to grant access again.");
                }
                else{
                    alert("Geolocation request error. Please reset location permission.");
                }
            }
        );
    }

locationButton.addEventListener("click", getUserCoordinates);
searchButton.addEventListener("click", getCityCoordinates);
cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinates());
