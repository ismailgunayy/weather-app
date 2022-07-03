import getAddress from './locationData.js';
import {
	getWeatherData,
	isWeatherDataFetchedLongerThan30mAgo,
} from './weatherData.js';

const inputElement = document.querySelector('.city-input');
const temperatureElement = document.querySelector('.temp');
const windElement = document.querySelector('.wind-value');
const rainElement = document.querySelector('.rain-value');
const humidityElement = document.querySelector('.humidity-value');
const unitSelectionElements = document.querySelectorAll('.unit');

let activeUnitSelection = 'metric';
let weatherData
// fetching the weather report according to the location (GeolocationAPI)
const locationData = await getAddress();
weatherData = JSON.parse(localStorage.getItem(`weatherData_${activeUnitSelection}`));

if (weatherData === null || isWeatherDataFetchedLongerThan30mAgo(weatherData)) {
	weatherData = await getWeatherData(locationData, activeUnitSelection);
	localStorage.setItem(`weatherData_${activeUnitSelection}`, JSON.stringify(weatherData));
}

// console.log('🚀 ~ weatherData', weatherData);

// Setting the values
function setUIValues() {
	inputElement.value = weatherData.name;
	temperatureElement.innerHTML =
		Math.floor(weatherData.main.temp) +
		(activeUnitSelection === 'metric' ? '℃' : '°F');
	windElement.innerHTML = weatherData.wind.speed;
	rainElement.innerHTML = weatherData.rain ? weatherData.rain['1h'] : 0;
	humidityElement.innerHTML = weatherData.main.humidity;
}


// Change the input size according to city name
inputElement.addEventListener('input', resizeInputBox);
function resizeInputBox() {
	inputElement.style.width = inputElement.value.length / 1.5 + 'em';
}

// Change the units according to activeUnitSelection
unitSelectionElements.forEach((element) => {
	const innerText = element.textContent.toLowerCase();
	element.addEventListener('click', async function (event) {
		if (activeUnitSelection !== innerText) {
			activeUnitSelection = innerText;
			weatherData = await getWeatherData(locationData, activeUnitSelection);
			localStorage.setItem(
				`weatherData_${activeUnitSelection}`,
				JSON.stringify(weatherData)
			);

			setUIValues();
		}
	});
});


setUIValues()
resizeInputBox()
