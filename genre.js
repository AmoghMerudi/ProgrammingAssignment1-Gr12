/**
 * Represents a genre containing movies.
 * @class
 */
class Genre {
    /**
     * Creates a new Genre instance.
     * 
     * @constructor
     * @param {String} name - Name of the genre.
     */
    constructor(name) {
        this.name = name;
        this.movies = [];
        this.starPositions = [];
    }

    /**
     * Adds a movie to the genre.
     * @param {Movie} movie - Movie to add.
     */
    addMovie(movie) {
        this.movies.push(movie);
    }

    /**
     * Displays the genre and its movies on the canvas.
     * @param {Number} x - X-coordinate for display.
     * @param {Number} y - Y-coordinate for display.
     */
    display(x, y) {
        push();
        translate(x, y);
        textAlign(CENTER);
        fill(255);
        textSize(50);
        text(this.name, 0, 0);

        const radius = 500;
        const angleStep = TWO_PI / this.movies.length;
        this.starPositions = [];

        this.movies.forEach((movie, i) => {
            const angle = i * angleStep;
            const starX = radius * cos(angle);
            const starY = radius * sin(angle);

            fill(movie.getBrightness());
            noStroke();
            ellipse(starX, starY, movie.getStarSize());

            this.starPositions.push({
                x: starX + x,
                y: starY + y,
                size: movie.getStarSize(),
                movie: movie
            });
        });
        pop();
    }

    /**
     * Checks if a movie was clicked based on mouse position.
     * @param {Number} mouseX - Mouse X-coordinate.
     * @param {Number} mouseY - Mouse Y-coordinate.
     * @returns {Movie|null} The clicked movie or null if none clicked.
     */
    checkClick(mouseX, mouseY) {
        return this.starPositions.find(
            star => dist(mouseX, mouseY, star.x, star.y) < star.size / 2
        )?.movie || null;
    }
}
