const geoLocationOptions = {
	enableHighAccuracy: true,
	timeout: 5000,
};

async function getLocation() {
	const position = await getCoordinates();

	const locationData = {};
	locationData.latitude = position.coords.latitude;
	locationData.longitude = position.coords.longitude;
	return locationData;
}

function getCoordinates() {
	return new Promise(function (resolve, reject) {
		navigator.geolocation.getCurrentPosition(
			resolve,
			reject,
			geoLocationOptions
		);
	});
}

export default getLocation;
