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
     * @param {Number} radius - Radius for the circular layout of stars.
     * @param {Number} rowHeight - Row height for label spacing.
     */
    display(x, y, radius, rowHeight) {
        push();
        translate(x, y);
        textAlign(CENTER);
        const labelSize = Math.max(16, Math.min(34, rowHeight * 0.2));
        textSize(labelSize);
        textStyle(BOLD);
        const labelPaddingX = 14;
        const labelPaddingY = 8;
        const labelWidth = textWidth(this.name) + labelPaddingX * 2;
        const labelHeight = labelSize + labelPaddingY * 2;
        noStroke();
        fill(18, 16, 14, 180);
        rect(-labelWidth / 2, -labelHeight / 2, labelWidth, labelHeight, 8);

        fill(235, 230, 220);
        text(this.name, 0, labelSize * 0.35);

        const angleStep = TWO_PI / this.movies.length;
        this.starPositions = [];

        // Loop through each movie to calculate its position and display it
        this.movies.forEach((movie, i) => {
            const angle = i * angleStep;
            const starX = radius * cos(angle);
            const starY = radius * sin(angle) + labelHeight * 0.35;

            const baseColor = color(movie.getColor());
            noStroke();

            // Soft glow
            fill(red(baseColor), green(baseColor), blue(baseColor), 40);
            ellipse(starX, starY, movie.getStarSize() * 2.6);

            // Core star
            fill(baseColor); // Set the fill color based on the movie's revenue
            noStroke();
            ellipse(starX, starY, movie.getStarSize()); // Draw the star representing the movie

            // Stores the position and details of the star for later click detection
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

    /**
     * Finds the closest hovered movie for smooth hover effects.
     * @param {Number} mouseX - Mouse X-coordinate.
     * @param {Number} mouseY - Mouse Y-coordinate.
     * @returns {{movie: Movie, distance: Number} | null} Hover info.
     */
    getHoverMovie(mouseX, mouseY) {
        let closest = null;
        this.starPositions.forEach(star => {
            const distance = dist(mouseX, mouseY, star.x, star.y);
            const hoverRadius = Math.max(8, star.size * 0.9);
            if (distance <= hoverRadius && (!closest || distance < closest.distance)) {
                closest = { movie: star.movie, distance };
            }
        });
        return closest;
    }
}
