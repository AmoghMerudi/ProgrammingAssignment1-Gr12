/**
 * Represents a movie with title, popularity, and revenue.
 * @class
 */
class Movie {
    /**
     * Creates a new Movie instance.
     * 
     * @constructor
     * @param {string} title - Title of the movie.
     * @param {number} popularity - Popularity score of the movie.
     * @param {number} revenue - Revenue of the movie.
     */
    constructor(title, popularity, revenue) {
        this.title = title;
        this.popularity = popularity;
        this.revenue = revenue;
    }

    /**
     * Calculates the size of the star based on popularity.
     * @returns {number} Star size.
     */
    getStarSize() {
        return Math.max(2, Math.round(this.popularity / 5));
    }

    /**
     * Computes the brightness of the star based on revenue.
     * @returns {string} RGB color string representing brightness.
     */
    getBrightness() {
        const revenueMax = 500000000;
        const normalizedRevenue = constrain(this.revenue / revenueMax, 0, 1);
        const colorStops = [
            { offset: 0, color: [255, 0, 0] },
            { offset: 0.14, color: [255, 165, 0] },
            { offset: 0.28, color: [255, 255, 0] },
            { offset: 0.42, color: [0, 255, 0] },
            { offset: 0.57, color: [0, 0, 255] },
            { offset: 0.71, color: [75, 0, 130] },
            { offset: 0.85, color: [238, 130, 238] },
            { offset: 1, color: [255, 192, 230] }
        ];
        const [start, end] = this.getColorRange(normalizedRevenue, colorStops);
        return this.interpolateColor(normalizedRevenue, start, end);
    }

    /**
     * Retrieves the color range based on value.
     * @param {number} value - Normalized revenue value.
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
     * @param {number} value - Normalized value between 0 and 1.
     * @param {Object} start - Start color stop.
     * @param {Object} end - End color stop.
     * @returns {string} Interpolated RGB color.
     */
    interpolateColor(value, start, end) {
        const ratio = (value - start.offset) / (end.offset - start.offset);
        const r = lerp(start.color[0], end.color[0], ratio);
        const g = lerp(start.color[1], end.color[1], ratio);
        const b = lerp(start.color[2], end.color[2], ratio);
        return `rgb(${round(r)}, ${round(g)}, ${round(b)})`;
    }
}
