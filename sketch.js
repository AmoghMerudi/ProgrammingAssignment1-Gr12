/**
 * Main sketch file for displaying genres and movies.
 */

let table; // Holds the loaded CSV data for movies

let genres = {}; // Stores each genre as a key with an associated Genre object containing movies in that genre

let selectedMovie = null; // Stores the currently selected movie object when a movie is clicked, or null if no movie is selected
let circleLocationX = null; // Stores the X-coordinate of the mouse click for displaying movie details
let circleLocationY = null; // Stores the Y-coordinate of the mouse click for displaying movie details
let hoveredMovie = null; // Stores the currently hovered movie object
let hoverTargetX = null; // Target X for smooth hover label
let hoverTargetY = null; // Target Y for smooth hover label
let hoverX = null; // Smoothed X for hover label
let hoverY = null; // Smoothed Y for hover label
let hoverAlpha = 0; // Smoothed alpha for hover label

/**
 * Loads the CSV file containing movie data.
 */
function preload() {
    console.log("Attempting to load CSV file...");
    table = loadTable('/tmdb_5000_movies.csv', 'csv', 'header', loadSuccess, loadError);
}

/**
 * Callback function when the CSV file loads successfully.
 */
function loadSuccess() {
    console.log("CSV loaded successfully");
}

/**
 * Callback function when the CSV file fails to load.
 */
function loadError() {
    console.error("Failed to load CSV file.");
}

/**
 * P5.js setup function. Initializes the canvas and processes data.
 */
function setup() {
    createCanvas(windowWidth * 2, windowHeight * 9);
    handleData();
}

/**
 * Processes data from the CSV and stores it in genres.
 */
function handleData() {
    table.rows.forEach(row => {
        const title = row.getString("original_title") || "Unknown";
        const popularity = row.getNum("popularity") || 0;
        const revenue = row.getNum("revenue") || 0;
        const genreArr = parseGenres(row.getString("genres"));

        const movie = new Movie(title, popularity, revenue);

        // Loop through each genre in the genreArr Array
        for (let i = 0; i < genreArr.length; i++) {
            const genre = genreArr[i];

            if (!genres[genre]) {
                genres[genre] = new Genre(genre); //If a genre does not exist, create a new Genre instance and add it to the genres object
            }
            genres[genre].addMovie(movie);
        }
        
    });

    console.log(genres);
}

/**
 * Parses the genres string from the movie data.
 * @param {string} genreStr - JSON string of genres.
 * @returns {string[]} Array of genre names.
 */
function parseGenres(genreStr) {
    try {
        return JSON.parse(genreStr).map(g => g.name);
    } 
    catch (error) {
        console.warn("Failed to parse genres:", genreStr);
        return ["Unknown"];
    }
}

/**
 * Draws the genres and movie details.
 */
function draw() {
    drawBackground();
    const genreList = Object.keys(genres);
    const cols = Math.max(2, ceil(sqrt(genreList.length)));
    const rows = ceil(genreList.length / cols);
    const marginX = width * 0.08;
    const marginY = height * 0.06;
    const colWidth = (width - marginX * 2) / cols;
    const rowHeight = (height - marginY * 2) / rows;
    const cellPaddingX = colWidth * 0.12;
    const cellPaddingY = rowHeight * 0.12;

    genreList.forEach((genreName, i) => {
        const col = i % cols;
        const row = floor(i / cols);
        const x = marginX + col * colWidth + colWidth / 2;
        const y = marginY + row * rowHeight + rowHeight / 2;
        const usableWidth = colWidth - cellPaddingX * 2;
        const usableHeight = rowHeight - cellPaddingY * 2;
        const radius = Math.min(usableWidth, usableHeight) * 0.4;
        genres[genreName].display(x, y, radius, rowHeight);
    });

    if (selectedMovie) {
        displayMovieDetails();
    }

    drawHoverDetails();
}

/**
 * Draws a subtle, cinematic background without purple/blue gradients.
 */
function drawBackground() {
    const ctx = drawingContext;
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#0d1512'); // deep pine
    gradient.addColorStop(0.6, '#1f2018'); // muted charcoal
    gradient.addColorStop(1, '#2b1a0f'); // warm umber

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Subtle vignette for depth
    noFill();
    const vignetteColor = color(0, 0, 0, 110);
    for (let i = 0; i < 10; i++) {
        stroke(vignetteColor);
        const inset = i * 18;
        rect(inset, inset, width - inset * 2, height - inset * 2);
    }
}

/**
 * Displays details of the selected movie.
 */
function displayMovieDetails() {
    fill(255);
    textSize(16);
    textAlign(LEFT);
    text(
        `Title: ${selectedMovie.title}\n` +
        `Popularity: ${selectedMovie.popularity}\n` +
        `Revenue: $${selectedMovie.revenue.toLocaleString()}`,
        circleLocationX, circleLocationY
    );
}

/**
 * Displays a smooth hover tooltip for the current movie.
 */
function drawHoverDetails() {
    const targetAlpha = hoveredMovie ? 220 : 0;
    hoverAlpha = lerp(hoverAlpha, targetAlpha, 0.15);
    if (hoverAlpha < 1) {
        return;
    }

    if (hoverTargetX !== null && hoverTargetY !== null) {
        hoverX = hoverX === null ? hoverTargetX : lerp(hoverX, hoverTargetX, 0.2);
        hoverY = hoverY === null ? hoverTargetY : lerp(hoverY, hoverTargetY, 0.2);
    }

    if (!hoveredMovie || hoverX === null || hoverY === null) {
        return;
    }

    const padding = 10;
    textSize(12);
    textAlign(LEFT, TOP);

    const lines = [
        hoveredMovie.title,
        `Popularity: ${hoveredMovie.popularity}`
    ];

    const lineHeight = 16;
    const textWidthMax = Math.max(...lines.map(line => textWidth(line)));
    const boxWidth = textWidthMax + padding * 2;
    const boxHeight = lines.length * lineHeight + padding * 2;

    noStroke();
    fill(20, 18, 16, hoverAlpha);
    rect(hoverX, hoverY, boxWidth, boxHeight, 6);

    fill(240, 235, 225, hoverAlpha);
    text(lines.join('\n'), hoverX + padding, hoverY + padding);
}

/**
 * Stores the mouse location and checks if a movie was clicked.
 */
function mousePressed() {
    // Store the current mouse X and Y coordinates for displaying movie details
    circleLocationX = mouseX;
    circleLocationY = mouseY;

    // Loop through each genre and check if a movie was clicked
    selectedMovie = Object.values(genres)
        .map(genre => genre.checkClick(mouseX, mouseY)) 
        .find(movie => movie !== null); 

    // Redraw the canvas to display any updates, such as selected movie details
    redraw();
}

/**
 * Tracks hover target and updates smooth tooltip position.
 */
function mouseMoved() {
    const hoverInfo = findHoverTarget(mouseX, mouseY);
    if (hoverInfo) {
        hoveredMovie = hoverInfo.movie;
        hoverTargetX = mouseX + 14;
        hoverTargetY = mouseY + 14;
    } else {
        hoveredMovie = null;
    }
}

/**
 * Finds the closest hovered movie across all genres.
 * @param {Number} x - Mouse X-coordinate.
 * @param {Number} y - Mouse Y-coordinate.
 * @returns {{movie: Movie, distance: Number} | null} Hover info.
 */
function findHoverTarget(x, y) {
    let closest = null;
    Object.values(genres).forEach(genre => {
        const info = genre.getHoverMovie(x, y);
        if (!info) {
            return;
        }
        if (!closest || info.distance < closest.distance) {
            closest = info;
        }
    });
    return closest;
}

