var monthDays = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365];

// Estimate the altitude and azimuth of the sun.
// The parameter is an object with the following properties:
// inputs.lat - The latitude in decimal form.
// inputs.lon - The longitude in decimal form.
// inputs.year - The year.
// inputs.month - The month from 1 to 12.
// inputs.day - The day of the month, starting from 1.
// inputs.hours - The hours from 0 to 23.
// inputs.minutes - The minutes from 0 to 59.
// inputs.seconds - The seconds from 0 to 59.
// inputs.offset - The hours offset from UTC.
var calculatePosition = function(inputs) {
    var dayNum = dayOfYear(inputs.year, inputs.month, inputs.day);
    var timeFrac = inputs.hours + inputs.minutes / 60 + inputs.seconds / 3600
	- inputs.offset;
    var yearFrac = (dayNum - 0.5 + timeFrac / 24) * 360 / 365.25;
    var declination = solarDeclination(yearFrac);
    var hourAngle = solarHourAngle(yearFrac, timeFrac, inputs.lon);
    var alt = solarAltitude(inputs.lat, declination, hourAngle);
    var az = solarAzimuth(inputs.lat, declination, alt, hourAngle);
    return [alt, az];
};

// Get the day of the year from 1 to 366.
var dayOfYear = function(year, month, day) {
    return monthDays[month - 1] + day + (month > 2 && isLeap(year));
};

// Get whether a year is a leap year.
var isLeap = function(year){
    return year % 4 == 0 && (year % 100 != 0 || year % 400 == 0);
};

// Estimate the solar declination given a fractional year out of 360 degrees.
var solarDeclination = function(yearFraction) {
    var y = yearFraction * Math.PI / 180;
    return 0.396372 - 22.91327 * Math.cos(y) + 4.02543 * Math.sin(y)
	- 0.387205 * Math.cos(y * 2) + 0.051967 * Math.sin(y * 2)
	- 0.154527 * Math.cos(y * 3) + 0.084798 * Math.sin(y * 3);
};

// Estimate the solar hour angle given a fractional year out of 360 degrees,
// fractional time out of 24 hours, and longitude.
var solarHourAngle = function(yearFraction, timeFraction, lon) {
    var y = yearFraction * Math.PI / 180;
    var correction = 0.004297 + 0.107029 * Math.cos(y)
	- 1.837877 * Math.sin(y) - 0.837378 * Math.cos(y * 2)
	- 2.340475 * Math.sin(y * 2);
    return ((timeFraction - 12) * 15 + lon + correction + 540) % 360 - 180;
};

// Estimate the solar altitude given latitude, solar declination, and solar
// hour angle.
var solarAltitude = function(lat, declination, hourAngle) {
    var l = lat * Math.PI / 180;
    var d = declination * Math.PI / 180;
    var h = hourAngle * Math.PI / 180;
    var cosZenith = Math.sin(l) * Math.sin(d) + Math.cos(l)
	* Math.cos(d) * Math.cos(h);
    cosZenith = Math.min(1, Math.max(-1, cosZenith));
    return 90 - Math.acos(cosZenith) * 180 / Math.PI;
};

// Estimate the solar azimuth given latitude, solar declination, solar
// altitude, and solar hour angle.
var solarAzimuth = function(lat, declination, altitude, hourAngle) {
    var l = lat * Math.PI / 180;
    var d = declination * Math.PI / 180;
    var a = altitude * Math.PI / 180;
    var h = hourAngle * Math.PI / 180;
    var sinAz = -Math.sin(h) * Math.cos(d) / Math.cos(a);
    var cosAz = (Math.sin(d) * Math.cos(l) - Math.cos(h)
		 * Math.cos(d) * Math.sin(l)) / Math.cos(a);
    if (isNaN(sinAz) || isNaN(cosAz)) {
	return 0;
    }
    cosAz = Math.min(1, Math.max(-1, cosAz));
    var az = Math.acos(cosAz) * 180 / Math.PI;
    if (Math.sign(sinAz) == -1) {
	az = 360 - az;
    }
    return az;
};

// Get the number of days in a month.
var daysInMonth = function(month, year) {
    return monthDays[month] - monthDays[month - 1] +
	(month == 2 && isLeap(year));
};

// Get a string representing the direction of an azimuth angle.
var direction = function(angle) {
    if (angle <= 22.5) {
	return "N";
    } else if (angle <= 67.5) {
	return "NE";
    } else if (angle <= 112.5) {
	return "E";
    } else if (angle <= 157.5) {
	return "SE";
    } else if (angle <= 202.5) {
	return "S";
    } else if (angle <= 247.5) {
	return "SW";
    } else if (angle <= 292.5) {
	return "W";
    } else if (angle <= 337.5) {
	return "NW";
    } else {
	return "N";
    }
};

// Get the two-digit string representation of a number.
var getTwoDigits = function(num) {
    var str = num.toString().substr(0, 2);
    if (str.length < 2) {
	str = "0" + str;
    }
    return str;
};

// Get the weighted average of two arrays, with the weight applied to arr1.
var weightedAverage = function(arr1, arr2, weight) {
    var arr = new Array(arr1.length);
    for (var i = 0; i < arr1.length; i++) {
	arr[i] = arr1[i] * weight + arr2[i] * (1 - weight);
    }
    return arr;
};

// Get an array with the rounded elements of the given array.
var roundArray = function(arr) {
    var rounded = new Array(arr.length);
    for (var i = 0; i < arr.length; i++) {
	rounded[i] = Math.round(arr[i]);
    }
    return rounded;
};

// Get the canvas coordinates of an altitude and azimuth.
var canvasCoords = function(alt, az, minAz, x, y, r) {
    var diff = (az - minAz + 360) % 360;
    if (diff >= 270) {
	diff -= 360;
    }
    var width = viewWidth(alt, r);
    var canvasX = diff / 180 * width + x - width / 2;
    var canvasY = y - (alt / 90) * r;
    return [canvasX, canvasY];
};

// Get the pixel width of the viewing window at an altitude.
var viewWidth = function(alt, r) {
    return 2 * Math.sqrt(r ** 2 - ((alt / 90) * r) ** 2);
};
