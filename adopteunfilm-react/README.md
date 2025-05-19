# README for AdopteUnFilm React Project

## Description
AdopteUnFilm is a movie recommendation application built with React. This project aims to provide users with personalized movie recommendations based on their preferences.

## Project Structure
```
adopteunfilm-react
├── public
│   ├── index.html
│   └── assets
│       ├── adopteunfilm.png
│       └── logotitre.png
├── src
│   ├── components
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── MovieCard.jsx
│   │   └── RecommendationsList.jsx
│   ├── pages
│   │   ├── Home.jsx
│   │   └── MySpace.jsx
│   ├── styles
│   │   └── styles.css
│   ├── utils
│   │   └── api.js
│   ├── App.jsx
│   └── index.js
├── package.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm (Node package manager)

### Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   cd adopteunfilm-react
   ```

2. Install the dependencies:
   ```
   npm install
   ```

### Running the Application
To start the application, run:
```
npm start
```
This will launch the application in your default web browser at `http://localhost:3000`.

### Project Features
- **Header Component**: Displays the logo, title, search form, and user actions.
- **Footer Component**: Contains copyright information.
- **MovieCard Component**: Shows movie details including the poster and title.
- **RecommendationsList Component**: Fetches and displays a list of movie recommendations.
- **Home Page**: The landing page of the application.
- **My Space Page**: User's personal space displaying a welcome message and recommendations.

### API Integration
The application interacts with a backend API to fetch movie recommendations. Ensure your API is running and accessible.

### Styles
Global styles are defined in `src/styles/styles.css`. You can customize the styles as needed.

### Contributing
Contributions are welcome! Please submit a pull request or open an issue for any suggestions or improvements.

### License
This project is licensed under the MIT License.

## Acknowledgments
- Thanks to the contributors and the open-source community for their support and resources.