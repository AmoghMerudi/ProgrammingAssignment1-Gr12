# **Movie Genre Visualization** 🎥  

## **Overview**  
This project visualizes movies and their genres by creating interactive star charts using **p5.js**. Each genre is represented as a group, and the movies within that genre are displayed as stars, with size and brightness influenced by their popularity and revenue, respectively. Users can click on a star to display details about a selected movie.

---

## **Features**  
- **Interactive visualization**: Displays genres and their corresponding movies.
- **Dynamic star size and brightness**: Movies' popularity determines star size, while revenue impacts brightness.
- **Click events**: Users can click on individual movies to see their details.
- **CSV data loading**: Uses a CSV file (`tmdb_5000_movies.csv`) for movie data.

---

## **Project Structure**  
├── sketch.js               - Main entry point for the p5.js sketch; handles setup, data loading, and rendering.
├── movie.js                - Defines the Movie class to represent individual movies with size and brightness logic.
├── genre.js                - Defines the Genre class to organize and display movies by genre.
├── tmdb_5000_movies.csv    - CSV dataset with movie information (must be placed in the root directory).
└── index.html              - HTML file to run the project in a browser.

