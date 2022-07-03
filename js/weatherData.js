async function getWeatherData({ latitude, longitude }, unit = 'metric') {
	const API_KEY = '6a9ce81dfa32b9002cbfc77cb080e0b4';
	const API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=${unit}`;

	console.log('REQUEST SENT');

	const response = await fetch(API_URL);
	const weatherData = response.json();
	return weatherData;
}

function isWeatherDataFetchedLongerThan1hAgo({ dt: weatherDataDate }) {
	return Math.floor(new Date() / 1000) - weatherDataDate > 60 * 60;
}

export { getWeatherData, isWeatherDataFetchedLongerThan1hAgo };
