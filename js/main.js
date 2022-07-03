import getAddress from './locationData.js';
import {
	getWeatherData,
	isWeatherDataFetchedLongerThan1hAgo,
} from './weatherData.js';

const dateElement = document.querySelector('.date');
const inputElement = document.querySelector('.city-input');
const mainTemperatureElement = document.querySelector('.main-temp');
const feelTemperatureElement = document.querySelector('.feel-temp');
const windElement = document.querySelector('.wind-value');
const rainElement = document.querySelector('.rain-value');
const humidityElement = document.querySelector('.humidity-value');
const unitSelectionElements = document.querySelectorAll('.unit');

inputElement.addEventListener('input', resizeInputBox);

let activeUnitSelection = 'metric';
let weatherData;
const locationData = await getAddress();

weatherData = JSON.parse(
	localStorage.getItem(`weatherData_${activeUnitSelection}`)
);

// fetches the data if there is no data in localStorage
// or the last fetched data is at least 1h long
if (weatherData === null || isWeatherDataFetchedLongerThan1hAgo(weatherData)) {
	await setWeatherData();
}


// Change the units according to activeUnitSelection
unitSelectionElements.forEach((element) => {
	const innerText = element.textContent.toLowerCase();
	element.addEventListener('click', async function (event) {
		if (activeUnitSelection !== innerText) {
			activeUnitSelection = innerText;
			await setWeatherData();
			setUIValues();
		}
	});
});

async function setWeatherData() {
	weatherData = await getWeatherData(locationData, activeUnitSelection);
	weatherData.date = new Date().toLocaleDateString('en-US', {
		month: 'long',
		day: 'numeric',
	});
	localStorage.setItem(
		`weatherData_${activeUnitSelection}`,
		JSON.stringify(weatherData)
	);
}

// Setting the values in UI
function setUIValues() {
	dateElement.innerHTML = weatherData.date;
	inputElement.value = weatherData.name;
	mainTemperatureElement.innerHTML =
		Math.floor(weatherData.main.temp) +
		(activeUnitSelection === 'metric' ? '℃' : '°F');

	feelTemperatureElement.innerHTML =
		'<span>feels like</span>' +
		`<span>${Math.floor(weatherData.main.feels_like)}</span>`;
	windElement.innerHTML = weatherData.wind.speed;
	rainElement.innerHTML = weatherData.rain ? weatherData.rain['1h'] : 0;
	humidityElement.innerHTML = weatherData.main.humidity;
}


// Change the input size according to city name
function resizeInputBox() {
	inputElement.style.width = inputElement.value.length / 1.5 + 'em';
}

setUIValues();
resizeInputBox();
