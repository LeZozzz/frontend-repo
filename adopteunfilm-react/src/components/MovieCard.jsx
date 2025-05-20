import React from 'react';
import { motion } from 'framer-motion';
import '../styles/MovieCard.css'; // Assuming you have a CSS file for styling

const MovieCard = ({ movie }) => {
    return (
        <motion.div
            className="movie-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <img src={movie.poster} alt={movie.title} className="movie-poster" />
            <div className="movie-info">
                <h2>{movie.title}</h2>
                <p>{movie.description}</p>
            </div>
        </motion.div>
    );
};

export default MovieCard;
