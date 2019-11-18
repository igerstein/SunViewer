// Sky color values for discrete sun altitudes. The first row holds values for
// altitude = -15 degrees, and altitude increases by 5 degrees with each row
// until altitude = 90 degrees. Each row has the following entries:
// [main sky RGB, upper horizon RGB, lower horizon RGB, inner sun RGB,
// outer sun RGB, surrounding sun RGBA]
var colorChart = [
    [6, 7, 12, 6, 7, 12, 6, 7, 12, 255, 255, 112, 6, 7, 12, 6, 7, 12, 0],
    [27, 31, 51, 46, 47, 61, 73, 62, 56, 255, 255, 112, 129, 93, 46, 73, 62, 56, 0],
    [55, 54, 74, 97, 90, 85, 150, 122, 86, 255, 255, 112, 242, 177, 89, 150, 122, 86, 32],
    [82, 86, 123, 138, 135, 139, 218, 188, 149, 255, 255, 112, 252, 187, 100, 218, 188, 149, 32],
    [80, 85, 124, 135, 135, 141, 214, 187, 152, 255, 255, 131, 255, 196, 108, 214, 187, 152, 64],
    [78, 86, 127, 128, 133, 146, 203, 185, 160, 255, 255, 160, 255, 214, 138, 203, 185, 160, 64],
    [80, 90, 133, 124, 133, 151, 193, 182, 166, 255, 255, 189, 255, 225, 174, 193, 182, 166, 64],
    [81, 93, 138, 119, 132, 155, 183, 179, 172, 255, 255, 217, 254, 235, 210, 183, 179, 172, 64],
    [82, 96, 144, 117, 133, 160, 177, 178, 176, 255, 250, 228, 229, 218, 215, 177, 178, 176, 64],
    [82, 98, 149, 115, 134, 164, 171, 177, 180, 254, 244, 238, 203, 200, 220, 115, 134, 164, 64],
    [85, 103, 158, 113, 136, 170, 166, 177, 185, 255, 250, 247, 197, 198, 228, 113, 136, 170, 64],
    [88, 108, 166, 111, 137, 175, 161, 177, 190, 255, 255, 255, 190, 196, 236, 111, 137, 175, 64],
    [90, 112, 172, 110, 138, 178, 158, 177, 192, 255, 255, 255, 185, 193, 239, 110, 138, 178, 64],
    [91, 115, 177, 108, 138, 180, 154, 176, 194, 255, 255, 255, 179, 190, 242, 108, 138, 180, 64],
    [92, 118, 182, 106, 139, 182, 151, 176, 196, 255, 255, 255, 175, 188, 244, 106, 139, 182, 64],
    [93, 121, 186, 104, 139, 183, 148, 176, 197, 255, 255, 255, 171, 186, 245, 93, 121, 186, 64],
    [95, 123, 191, 103, 139, 184, 146, 176, 198, 255, 255, 255, 169, 186, 247, 95, 123, 191, 64],
    [97, 125, 195, 101, 139, 184, 144, 176, 199, 255, 255, 255, 167, 186, 248, 97, 125, 195, 64],
    [101, 130, 201, 99, 139, 184, 143, 177, 201, 255, 255, 255, 167, 187, 250, 101, 130, 201, 64],
    [105, 134, 207, 96, 138, 184, 141, 177, 202, 255, 255, 255, 166, 188, 252, 105, 134, 207, 64],
    [110, 139, 213, 95, 138, 184, 141, 179, 204, 255, 255, 255, 166, 189, 253, 110, 139, 213, 64],
    [114, 144, 218, 93, 137, 184, 140, 180, 206, 255, 255, 255, 165, 189, 254, 114, 144, 218, 64]
];

// Sun radius values for discrete sun altitudes. The rows correspond to the
// rows of the color chart. Each row has the following entries, as fractions
// of the maximum radius:
// [white radius, inner sun radius, outer sun radius,
// surrounding sun radius, fade-out radius]
var radiusChart = [
    [0.005, 0.04, 0.25, 0.6, 1],
    [0.005, 0.04, 0.25, 0.6, 1],
    [0.005, 0.04, 0.15, 0.6, 1],
    [0.005, 0.04, 0.1, 0.6, 1],
    [0.005, 0.06, 0.1, 0.6, 1],
    [0.01, 0.06, 0.1, 0.6, 0.9],
    [0.02, 0.06, 0.1, 0.55, 0.8],
    [0.03, 0.06, 0.1, 0.5, 0.7],
    [0.035, 0.06, 0.1, 0.45, 0.6],
    [0.04, 0.06, 0.1, 0.4, 0.5],
    [0.045, 0.055, 0.1, 0.36, 0.45],
    [0.05, 0.05, 0.1, 0.32, 0.4],
    [0.05, 0.05, 0.1, 0.32, 0.4],
    [0.05, 0.05, 0.1, 0.32, 0.4],
    [0.05, 0.05, 0.1, 0.32, 0.4],
    [0.05, 0.05, 0.1, 0.32, 0.4],
    [0.05, 0.05, 0.1, 0.32, 0.4],
    [0.05, 0.05, 0.1, 0.32, 0.4],
    [0.05, 0.05, 0.1, 0.32, 0.4],
    [0.05, 0.05, 0.1, 0.32, 0.4],
    [0.05, 0.05, 0.1, 0.32, 0.4],
    [0.05, 0.05, 0.1, 0.32, 0.4]
];

var content = document.getElementById("content");
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// Draw the image on the canvas.
// Parameters are sun altitude, sun azimuth, the center azimuth of the viewing
// window, and whether to draw the altazimuth grid.
var drawCanvas = function(alt, az, viewAz, grid) {
    // If necessary, resize the canvas.
    if (canvas.width != content.offsetWidth) {
	canvas.width = content.offsetWidth;
	canvas.height = (5 / 9) * canvas.width;
    }

    // The canvas coordinates of the origin (center of horizon).
    var x = canvas.width / 2;
    var y = canvas.height - 50;

    // The radius of the viewing window.
    var r = x - 50;

    // The canvas coordinates of the sun.
    var minAz = (viewAz + 270) % 360;
    var sunCoords = canvasCoords(alt, az, minAz, x, y, r);

    // The sky colors and sun radii for the given altitude.
    var values = drawingValues(alt);
    var colors = values[0];
    var radii = values[1];
    
    // Draw the image.
    drawBackgroundSky(colors.slice(0, 9), x, y, r);
    drawSun(colors.slice(9), radii, sunCoords[0], sunCoords[1], r / 2);
    drawFrame(x, y, r);

    if (grid) {
	// Overlay the altazimuth grid.
	drawGrid(x, y, r, viewAz);
    }
};

// Get the sky colors and sun radii for drawing on the canvas.
var drawingValues = function(altitude) {
    // Look up the nearest values from the charts.
    var index = altitude / 5 + 3;
    index = Math.min(colorChart.length - 1, Math.max(0, index));
    var colors = colorChart[Math.round(index)];
    var radii = radiusChart[Math.round(index)];

    // Interpolate if between two chart indices.
    var diff = index - Math.round(index);
    if (diff != 0) {
	var index2 = Math.round(index) + Math.sign(diff);
	var weight = 1 - Math.abs(diff);
	colors = weightedAverage(colors, colorChart[index2], weight);
	colors = roundArray(colors);
	radii = weightedAverage(radii, radiusChart[index2], weight);
    }
    return [colors, radii];
};

// Draw the background sky on the canvas.
var drawBackgroundSky = function(colors, x, y, r) {
    // Draw the main sky color.
    ctx.fillStyle = "rgb(" + colors.slice(0, 3) + ")";
    ctx.fillRect(x - r, y - r, 2 * r, r);

    // Draw the horizon color gradient.
    var grd = ctx.createLinearGradient(0, y - (4 / 9) * r, 0, y);
    grd.addColorStop(0, "rgb(" + colors.slice(0, 3) + ")");
    grd.addColorStop(0.5, "rgb(" + colors.slice(3, 6) + ")");
    grd.addColorStop(1, "rgb(" + colors.slice(6, 9) + ")");
    ctx.fillStyle = grd;
    ctx.fillRect(x - r, y - (4 / 9) * r, 2 * r, (4 / 9) * r);
};

// Draw the sun on the canvas.
var drawSun = function(colors, radii, sunX, sunY, maxRadius) {
    var grd = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, maxRadius);
    grd.addColorStop(0, "rgb(255,255,255)");
    grd.addColorStop(radii[0], "rgb(255, 255, 255)");
    grd.addColorStop(radii[1], "rgb(" + colors.slice(0, 3) + ")");
    grd.addColorStop(radii[2], "rgb(" + colors.slice(3, 6) + ")");
    grd.addColorStop(radii[3], "rgba(" + colors.slice(6, 9) + "," +
		     colors[9] / 256 + ")");
    grd.addColorStop(radii[4], "rgba(" + colors.slice(6, 9) + ",0)");
    ctx.fillStyle = grd;
    ctx.arc(sunX, sunY, maxRadius, 0, 2 * Math.PI);
    ctx.fill();
};

// Draw the window frame on the canvas.
var drawFrame = function(x, y, r) {
    ctx.beginPath();
    ctx.strokeStyle = "DimGray";
    ctx.lineWidth = r;
    ctx.arc(x, y, (3 / 2) * r, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.beginPath();
    ctx.fillStyle = "DimGray";
    ctx.fillRect(x - r, y, 2 * r, canvas.height - y);
};

// Draw the altazimuth grid on the canvas.
var drawGrid = function(x, y, r, viewAz) {
    ctx.strokeStyle = "LimeGreen";
    ctx.lineWidth = 1;
    ctx.fillStyle = "LimeGreen";
    ctx.font = "14px sans-serif";
    drawAltitudeLines(x, y, r);
    drawAzimuthLines(x, y, r, viewAz);
};

// Draw the altitude lines and labels on the canvas.
var drawAltitudeLines = function(x, y, r) {
    ctx.textAlign = "right";
    ctx.textBaseline = "bottom";
    ctx.beginPath();
    for (var alt = 0; alt <= 75; alt += 15) {
	var length = viewWidth(alt, r);
	var lineY = y - (alt / 90) * r;
	ctx.moveTo(x - length / 2, lineY);
	ctx.lineTo(x + length / 2, lineY);
	ctx.fillText(alt + "\u00B0", x - length / 2 - 1, lineY);
    }
    ctx.stroke();
    ctx.textAlign = "center";
    ctx.fillText("90\u00B0", x, y - r);
};

// Draw the azimuth lines and labels on the canvas.
var drawAzimuthLines = function(x, y, r, viewAz) {
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y - r);
    ctx.stroke();
    ctx.fillText(viewAz + "\u00B0", x, y + 3);
    for (var i = 1; i <= 6; i++) {
	ctx.beginPath();
	ctx.ellipse(x, y, (i / 6) * r, r, 0, Math.PI, 2 * Math.PI);
	ctx.stroke();
	ctx.fillText((viewAz + i * 15 + 360) % 360 + "\u00B0",
		     x + (i / 6) * r, y + 3);
	ctx.fillText((viewAz - i * 15 + 360) % 360 + "\u00B0",
		     x - (i / 6) * r, y + 3);
    }
};
