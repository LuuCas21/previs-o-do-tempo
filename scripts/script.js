'use script';

const notificationElement = document.querySelector('.notification');
const iconElement = document.querySelector('.weather-icon');
const tempElement = document.querySelector('.temperature-value p'); // I am gonna add the paragraph inside the element
const descElement = document.querySelector('.temperature-description p'); // I am gonna add the paragraph inside the element
const locationElement = document.querySelector('.location p'); // I am gonna add the paragraph inside the element

// The best way to store the data is inside an object

const weather = {
    temperature : {
        value: 18,
        unit: 'celsius'
    },

    description: 'few clouds',
    iconId: '01d',
    city: 'London',
    country: 'GB',

};

// I am gonna use them many times so I'll put them inside a function

function displayWeather() {
iconElement.innerHTML = `<img src="/icons/${weather.iconId}.png" />`;
tempElement.innerHTML = `${weather.temperature.value}° <span>C</span>`;
descElement.innerHTML = `${weather.description}`;
locationElement.innerHTML = `${weather.city}, ${weather.country}`;
};

// Convert Celsius to Fahrenheit

function celsiusToFahrenheit(temperature) {
    return (temperature * 9/5) + 32;
};

tempElement.addEventListener('click', function() {
    if (weather.temperature.value === undefined) return // If we didnt get any data from the API. If the user clicks on the temperature it will show an error
    // if the temperature.value is undefined, the 'return' will prevent the code below from running

    if (weather.temperature.unit === 'celsius') {
        let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
        fahrenheit = Math.floor(fahrenheit); // We don't need to show numbers after the dot (We want whole numbers only, an integer)

        tempElement.innerHTML = `${fahrenheit}° <span>F</span>`;
        weather.temperature.unit = 'fahrenheit'; // Change to fahrenheit
    } else {
        tempElement.innerHTML = `${weather.temperature.value}° <span>C</span>`; // The default is always celcius (no need to convert from fahrenheit to celsius)
        weather.temperature.unit = 'celsius';
    }
})

// it will take three call backs, the setPosition and the last two ones are not so important
// the error callback is optional
//getCurrentPosition(setPosition,error);
// it gets the argument position
//setPosition(position);

// it gets the argument error
//error(error);

// position is an object and the elements inside it that are importants are the latitude and longitude

// Check if the user device has geolocation
if ('geolocation' in navigator) {
    // get the current position of the user
    navigator.geolocation.getCurrentPosition(setPosition, showError); // we're gonna call two functions 'setPosition' and 'showError'
} else {
    notificationElement.style.display = 'block'; // make it visible first
    notificationElement.innerHTML = "<p>Browser Doesn't Support Geolocation.</p>";
};

function setPosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    console.log(position);

    getWeather(latitude, longitude);
};

function showError(error) {
    notificationElement.style.display = 'block';
    notificationElement.innerHTML = `<p>${error.message}</p>`;
    console.log(error);
};

const KELVIN = 273; // it will help us to do the conversion from kelvin to celsius
const key = '82005d27a116c2880c8f0fcb866998a0';

function getWeather(latitude, longitude) {
    let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;

    fetch(api).then(function(response) {
        let data = response.json();
        return data;
    }).then(function(data) {
        weather.temperature.value = Math.floor(data.main.temp - KELVIN);
        weather.description = data.weather[0].description;
        weather.iconId = data.weather[0].icon;
        weather.city = data.name;
        weather.country = data.sys.country;
    }).then(function() {
        displayWeather();
    })
};