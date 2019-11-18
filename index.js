// The elements for displaying position.
var altElem = document.getElementById("alt");
var azElem = document.getElementById("az");

// The text fields for user input.
var latElem = document.getElementById("lat");
var lonElem = document.getElementById("lon");
var yearElem = document.getElementById("year");
var monthElem = document.getElementById("month");
var dayElem = document.getElementById("day");
var hoursElem = document.getElementById("hours");
var minutesElem = document.getElementById("minutes");
var secondsElem = document.getElementById("seconds");
var offsetElem = document.getElementById("utc-offset");

// The time slider.
var timeElem = document.getElementById("time-slider");

// The default values for sun position calculation.
var defaults = {};
defaults.lat = parseFloat(latElem.value);
defaults.lon = parseFloat(lonElem.value);
defaults.year = parseInt(yearElem.value);
defaults.month = parseInt(monthElem.value);
defaults.day = parseInt(dayElem.value);
defaults.hours = parseInt(hoursElem.value);
defaults.minutes = parseInt(minutesElem.value);
defaults.seconds = parseInt(secondsElem.value);
defaults.offset = parseFloat(offsetElem.value);

// The values for drawing the canvas image.
var inputs = Object.assign({}, defaults);
var viewAz = document.getElementById("view-az").value * 15;
var grid = document.getElementById("grid").checked;

// The animation values.
var animating = false;
var animation = null;
var speed = parseInt(document.getElementById("animation-speed").innerHTML);

// Update the displayed position and canvas image.
var updateDisplay = function() {
    var position = calculatePosition(inputs);
    var alt = position[0];
    var az = position[1];
    altElem.innerHTML = alt.toFixed(1) + "&#176;";
    azElem.innerHTML = az.toFixed(1) + "&#176; (" + direction(az) + ")"; 
    drawCanvas(alt, az, viewAz, grid);
};

// Called when the latitude field is edited.
var updateLat = function(value) {
    var lat = parseFloat(value);
    if (isNaN(lat)) {
	lat = defaults.lat;
    }
    inputs.lat = Math.min(90, Math.max(-90, lat));
    updateDisplay();
};

// Called when the longitude field is edited.
var updateLon = function(value) {
    var lon = parseFloat(value);
    if (isNaN(lon)) {
	lon = defaults.lon;
    }
    inputs.lon = Math.min(180, Math.max(-180, lon));
    updateDisplay();
};

// Called when the year field is edited.
var updateYear = function(value) {
    var year = parseInt(value);
    if (isNaN(year)) {
	year = defaults.year;
    }
    inputs.year = Math.min(99999, Math.max(-99999, year));
    updateDisplay();
};

// Called when the month field is edited.
var updateMonth = function(value) {
    var month = parseInt(value);
    if (isNaN(month)) {
	month = defaults.month;
    }
    inputs.month = Math.min(12, Math.max(1, month));
    updateDisplay();
};

// Called when the day field is edited.
var updateDay = function(value) {
    var day = parseInt(value);
    if (isNaN(day)) {
	day = defaults.day;
    }
    inputs.day = Math.min(daysInMonth(inputs.month, inputs.year),
			  Math.max(1, day));
    updateDisplay();
};

// Called when the hours field is edited.
var updateHours = function(value) {
    var hours = parseInt(value);
    if (isNaN(hours)) {
	hours = defaults.hours;
    }
    inputs.hours = Math.min(23, Math.max(0, hours));
    setTimeSlider();
    updateDisplay();
};

// Called when the minutes field is edited.
var updateMinutes = function(value) {
    var minutes = parseInt(value);
    if (isNaN(minutes)) {
	minutes = defaults.minutes;
    }
    inputs.minutes = Math.min(59, Math.max(0, minutes));
    setTimeSlider();
    updateDisplay();
};

// Called when the seconds field is edited.
var updateSeconds = function(value) {
    var seconds = parseInt(value);
    if (isNaN(seconds)) {
	seconds = defaults.seconds;
    }
    inputs.seconds = Math.min(59, Math.max(0, seconds));
    setTimeSlider();
    updateDisplay();
};

// Called when the UTC offset field is edited.
var updateOffset = function(value) {
    var offset = parseFloat(value);
    if (isNaN(offset)) {
	offset = defaults.offset;
    }
    inputs.offset = Math.min(24, Math.max(-24, offset));
    updateDisplay();
};

// Increment the input value for the year.
var incrementYearInput = function() {
    var success = true;
    if (inputs.year < 99999) {
	inputs.year++;
	if (inputs.month == 2 && inputs.day == 29) {
	    inputs.day = 28;
	}
    } else {
	success = false;
    }
    yearElem.value = inputs.year;
    return success;
};

// Decrement the input value for the year.
var decrementYearInput = function() {
    var success = true;
    if (inputs.year > -99999) {
	inputs.year--;
	if (inputs.month == 2 && inputs.day == 29) {
	    inputs.day = 28;
	}
    } else {
	success = false;
    }
    yearElem.value = inputs.year;
    return success;
};

// Increment the input value for the month.
var incrementMonthInput = function() {
    var success = true;
    if (inputs.month < 12) {
	inputs.month++;
	var maxDays = daysInMonth(inputs.month, inputs.year);
	inputs.day = Math.min(inputs.day, maxDays);
    } else if (incrementYearInput()) {
	inputs.month = 1;
    } else {
	success = false;
    }
    monthElem.value = inputs.month;
    return success;
};

// Decrement the input value for the month.
var decrementMonthInput = function() {
    var success = true;
    if (inputs.month > 1) {
	inputs.month--;
	var maxDays = daysInMonth(inputs.month, inputs.year);
	inputs.day = Math.min(inputs.day, maxDays);
    } else if (decrementYearInput()) {
	inputs.month = 12;
    } else {
	success = false;
    }
    monthElem.value = inputs.month;
    return success;
};

// Increment the input value for the day.
var incrementDayInput = function() {
    var success = true;
    if (inputs.day < daysInMonth(inputs.month, inputs.year)) {
	inputs.day++;
    } else if (incrementMonthInput()) {
	inputs.day = 1;
    } else {
	success = false;
    }
    dayElem.value = inputs.day;
    return success;
};

// Decrement the input value for the day.
var decrementDayInput = function() {
    var success = true;
    if (inputs.day > 1) {
	inputs.day--;
    } else if (decrementMonthInput()) {
	inputs.day = daysInMonth(inputs.month, inputs.year);
    } else {
	success = false;
    }
    dayElem.value = inputs.day;
    return success;
};

// Called when the increment year button is clicked.
var incrementYear = function() {
    if (incrementYearInput()) {
	updateDisplay();
    }
};

// Called when the decrement year button is clicked.
var decrementYear = function() {
    if (decrementYearInput()) {
	updateDisplay();
    }
};

// Called when the increment month button is clicked.
var incrementMonth = function() {
    if (incrementMonthInput()) {
	updateDisplay();
    }
};

// Called when the decrement month button is clicked.
var decrementMonth = function() {
    if (decrementMonthInput()) {
	updateDisplay();
    }
};

// Called when the increment day button is clicked.
var incrementDay = function() {
    if (incrementDayInput()) {
	updateDisplay();
    }
};

// Called when the decrement day button is clicked.
var decrementDay = function() {
    if (decrementDayInput()) {
	updateDisplay();
    }
};

// Called when the grid checkbox is clicked.
var toggleGrid = function(checked) {
    grid = checked;
    updateDisplay();
};


// Called when the window center azimuth slider is moved.
var viewSlider = function(value) {
    viewAz = value * 15;
    var display = document.getElementById("view-az-display");
    display.innerHTML = viewAz + "&#176; (" + direction(viewAz) + ")";
    updateDisplay();
};

// Called when the time slider is moved.
var timeSlider = function(value) {
    inputs.hours = Math.floor(value / 3600);
    inputs.minutes = Math.floor(value % 3600 / 60);
    inputs.seconds = value % 60;
    hoursElem.value = getTwoDigits(inputs.hours);
    minutesElem.value = getTwoDigits(inputs.minutes);
    secondsElem.value = getTwoDigits(inputs.seconds);
    updateDisplay();
};

// Set the time slider based on the current input values.
var setTimeSlider = function() {
    timeElem.value = inputs.hours * 3600
	+ inputs.minutes * 60 + inputs.seconds;
};

// Fill in the fields for user datetime input.
var fillDatetimeElements = function() {
    yearElem.value = inputs.year;
    monthElem.value = inputs.month;
    dayElem.value = inputs.day;
    hoursElem.value = getTwoDigits(inputs.hours);
    minutesElem.value = getTwoDigits(inputs.minutes);
    secondsElem.value = getTwoDigits(inputs.seconds);
    setTimeSlider();
    offsetElem.value = inputs.offset;
};

// Fill in the fields for user input.
var fillElements = function() {
    latElem.value = inputs.lat;
    lonElem.value = inputs.lon;
    fillDatetimeElements();
}

// Set the input values based on the current date and time.
var currentDatetime = function() {
    var now = new Date();
    inputs.year = now.getFullYear();
    inputs.month = now.getMonth() + 1;
    inputs.day = now.getDate();
    inputs.hours = now.getHours();
    inputs.minutes = now.getMinutes();
    inputs.seconds = now.getSeconds();
    inputs.offset = now.getTimezoneOffset() / -60;
    fillDatetimeElements();
    updateDisplay();
};

// Called at an interval while playing the animation.
var animationLoop = function() {
    var totalSeconds = parseInt(timeElem.value)
	+ Math.sign(speed) * Math.max(1, Math.abs(speed / 100));
    while (totalSeconds >= 86400) {
	incrementDayInput();
	totalSeconds -= 86400;
    }
    while (totalSeconds < 0) {
	decrementDayInput();
	totalSeconds += 86400;
    }
    timeElem.value = totalSeconds;
    timeSlider(totalSeconds);
};

// Start the animation.
var startAnimation = function() {
    return setInterval(animationLoop, Math.max(10, Math.abs(1000 / speed)));
};

// Called when the animation play/pause button is clicked.
var toggleAnimation = function() {
    animating = !animating;
    if (animating) {
	document.getElementById("animate").innerHTML = "Pause";
	animation = startAnimation();
    } else {
	document.getElementById("animate").innerHTML = "Play";
	clearInterval(animation);
    }
};

// Change the animation speed.
var changeSpeed = function(newSpeed) {
    document.getElementById("animation-speed").innerHTML = newSpeed;
    if (animating && newSpeed != speed) {
	clearInterval(animation);
	speed = newSpeed;
	animation = startAnimation();
    }
    speed = newSpeed;
};

// Called when the increase animation speed button is clicked.
var increaseSpeed = function() {
    if (speed > 0) {
	var newSpeed = Math.min(100000, speed * 10);
    } else if (speed >= -1) {
	var newSpeed = -speed;
    } else {
	var newSpeed = speed / 10;
    }
    changeSpeed(newSpeed);
};

// Called when the decrease animation speed button is clicked.
var decreaseSpeed = function() {
    if (speed < 0) {
	var newSpeed = Math.max(-100000, speed * 10);
    } else if (speed <= 1) {
	var newSpeed = -speed;
    } else {
	var newSpeed = speed / 10;
    }
    changeSpeed(newSpeed);
};

// Call when the page first loads.
currentDatetime();
toggleAnimation();

// Set the input values based on the current location.
var fillLocation = function(location) {
    inputs.lat = latElem.value = location.coords.latitude;
    inputs.lon = lonElem.value = location.coords.longitude;
    document.getElementById("loc-message").innerHTML = "";
    updateDisplay();
};

// Display an error message since location could not be determined.
var locationError = function() {
    var message = document.getElementById("loc-message");
    message.innerHTML = "Location cannot be determined";
};

// If possible, get the user's location.
var currentLocation = function() {
    if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(fillLocation, locationError);
    } else {
	var message = document.getElementById("loc-message");
	message.innerHTML = "Geolocation is not supported by this browser";
    }
};

// Call when the page first loads.
currentLocation();
