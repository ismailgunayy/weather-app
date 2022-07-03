import getLocation from './locationData.js';
import {
	getWeatherData,
	isWeatherDataFetchedAtLeast1hAgo,
} from './weatherData.js';

let activeUnitSelection = 'metric';
let weatherData;
const locationData = await getLocation();

const dateElement = document.querySelector('.date');
const inputElement = document.querySelector('.city-input');
const mainTemperatureElement = document.querySelector('.main-temp');
const feelTemperatureElement = document.querySelector('.feel-temp');
const windElement = document.querySelector('.wind-value');
const rainElement = document.querySelector('.rain-value');
const humidityElement = document.querySelector('.humidity-value');
const unitSelectionElements = document.querySelectorAll('.unit');

inputElement.addEventListener('input', resizeInputBox);
unitSelectionElements.forEach(function (element) {
	element.addEventListener('click', restyleUnitSelections);
});

// Change the units according to activeUnitSelection
unitSelectionElements.forEach(function (element) {
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
	weatherData = JSON.parse(
		localStorage.getItem(`weatherData_${activeUnitSelection}`)
	);

	// makes request to the API if there is no data in localStorage
	// or the last fetched data came at least 1 hour ago
	if (weatherData === null || isWeatherDataFetchedAtLeast1hAgo(weatherData)) {
		weatherData = await getWeatherData(locationData, activeUnitSelection);
		localStorage.setItem(
			`weatherData_${activeUnitSelection}`,
			JSON.stringify(weatherData)
		);
	}
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

	windElement.innerHTML = Math.floor(weatherData.wind.speed);
	rainElement.innerHTML = weatherData.rain ? weatherData.rain['1h'] : 0;
	humidityElement.innerHTML = weatherData.main.humidity;
}

// Change the input size according to city name
function resizeInputBox(event) {
	inputElement.style.width = inputElement.value.length / 1.5 + 'em';
}

function restyleUnitSelections(event) {
	unitSelectionElements.forEach(function (element) {
		if (!activeUnitSelection.includes(event.target.textContent.toLowerCase())) {
			element.classList.toggle('active');
		}
	});
}

await setWeatherData();
setUIValues();
resizeInputBox();
