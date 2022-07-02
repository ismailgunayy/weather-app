import getAddress from './locationData.js';
import {
	getWeatherData,
	isWeatherDataFetchedLongerThan30mAgo,
} from './weatherData.js';

// fetching the weather report according to the location (GeolocationAPI)
const locationData = await getAddress();
let weatherData = JSON.parse(localStorage.getItem('weatherData'));

if (weatherData === null || isWeatherDataFetchedLongerThan30mAgo(weatherData)) {
	weatherData = await getWeatherData(locationData);
	localStorage.setItem('weatherData', JSON.stringify(weatherData));
}

console.log('🚀 ~ weatherData', weatherData);

const input = document.querySelector('.city-input');
const temp = document.querySelector('.temp');
const wind = document.querySelector('.wind-value');
const rain = document.querySelector('.rain-value');
const humidity = document.querySelector('.humidity-value');

input.value = weatherData.name;
temp.innerHTML = Math.floor(weatherData.main.temp) + '℃';
wind.innerHTML = weatherData.wind.speed;
rain.innerHTML = weatherData.rain ? weatherData.rain['1h'] : 0;
humidity.innerHTML = weatherData.main.humidity;

input.addEventListener('input', resizeInputBox);
function resizeInputBox() {
	input.style.width = input.value.length * 16 + 'px';
}
resizeInputBox();
