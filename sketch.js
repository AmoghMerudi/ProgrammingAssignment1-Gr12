/**
 * Main sketch file for displaying genres and movies.
 */

let table;
let genres = {};
let selectedMovie = null;
let circleLocationX = null;
let circleLocationY = null;

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

        genreArr.forEach(genre => {
            if (!genres[genre]) genres[genre] = new Genre(genre);
            genres[genre].addMovie(movie);
        });
    });

    console.log(genres);
}

/**
 * Parses the genres string from the movie data.
 * @param {String} genreStr - JSON string of genres.
 * @returns {String[]} Array of genre names.
 */
function parseGenres(genreStr) {
    try {
        return JSON.parse(genreStr).map(g => g.name);
    } catch (error) {
        console.warn("Failed to parse genres:", genreStr);
        return ["Unknown"];
    }
}

/**
 * P5.js draw function. Draws the genres and movie details.
 */
function draw() {
    background(123);
    const genreList = Object.keys(genres);
    const rows = ceil(genreList.length / 3);
    const colWidth = width / 3;
    const rowHeight = height / rows;

    genreList.forEach((genreName, i) => {
        const x = (i % 3) * colWidth + colWidth / 2;
        const y = floor(i / 3) * rowHeight + rowHeight / 2;
        genres[genreName].display(x, y);
    });

    if (selectedMovie) {
        displayMovieDetails();
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
 * P5.js mousePressed function. Checks if a movie is clicked.
 */
function mousePressed() {
    circleLocationX = mouseX;
    circleLocationY = mouseY;

    selectedMovie = Object.values(genres)
        .map(genre => genre.checkClick(mouseX, mouseY))
        .find(movie => movie !== null);
    
    redraw();
}
