/**
 * Represents a movie with title, popularity, and revenue.
 * @class
 */
class Movie {
    /**
     * Creates a new Movie instance.
     * 
     * @constructor
     * @param {String} title - Title of the movie.
     * @param {Number} popularity - Popularity score of the movie.
     * @param {Number} revenue - Revenue earned by the movie.
     */
    constructor(title, popularity, revenue) {
        this.title = title;
        this.popularity = popularity;
        this.revenue = revenue;
    }

    /**
     * Calculates the size of the star based on popularity.
     * @returns {Number} Star size.
     */
    getStarSize() {
        return Math.max(2, Math.round(this.popularity / 5));
    }

    /**
     * Computes the colour of the star based on revenue.
     * @returns {String} RGB color string representing brightness.
     */
    getColor() {
        const revenueMax = 500000000;
        const normalizedRevenue = constrain(this.revenue / revenueMax, 0, 1);
        const colorStops = [
            { offset: 0, color: [12, 74, 62] },      // Deep teal
            { offset: 0.25, color: [45, 140, 120] }, // Sea green
            { offset: 0.5, color: [210, 190, 120] }, // Warm sand
            { offset: 0.75, color: [240, 140, 80] }, // Amber
            { offset: 1, color: [230, 90, 85] }      // Coral
        ];
        const [start, end] = this.getColorRange(normalizedRevenue, colorStops); // Get the color range based on normalized revenue
        return this.interpolateColor(normalizedRevenue, start, end); // Interpolate the color between the start and end colors
    }

    /**
     * Retrieves the color range based on value.
     * @param {Number} value - Normalized revenue value.
     * @param {Object[]} stops - Array of color stops.
     * @returns {Object[]} Start and end color stop objects.
     */
    getColorRange(value, stops) {
        for (let i = 0; i < stops.length - 1; i++) {
            if (value >= stops[i].offset && value <= stops[i + 1].offset) {
                return [stops[i], stops[i + 1]];
            }
        }
        return [stops[0], stops[stops.length - 1]];
    }

    /**
     * Interpolates between two colors.
     * @param {Number} value - Normalized value between 0 and 1.
     * @param {Object} start - Start color stop.
     * @param {Object} end - End color stop.
     * @returns {String} Interpolated RGB color.
     */
    interpolateColor(value, start, end) {
        const ratio = (value - start.offset) / (end.offset - start.offset); // Calculating the interpolation ratio
        const r = lerp(start.color[0], end.color[0], ratio); // Interpolate the red component
        const g = lerp(start.color[1], end.color[1], ratio); // Interpolate the green component
        const b = lerp(start.color[2], end.color[2], ratio); // Interpolate the blue component
        return `rgb(${round(r)}, ${round(g)}, ${round(b)})`; // Return the interpolated RGB color as a string
    }
}
