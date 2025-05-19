import React from 'react';
import PropTypes from 'prop-types';
import './MovieCard.css'; // Assurez-vous de créer ce fichier pour les styles spécifiques au composant

const MovieCard = ({ movie }) => {
    return (
        <div className="movie-card">
            <img 
                src={movie.poster || 'https://via.placeholder.com/300x445?text=No+Image'} 
                alt={movie.title} 
            />
            <h3>{movie.title} ({movie.year ? movie.year.toString().substring(0, 4) : ''})</h3>
        </div>
    );
};

MovieCard.propTypes = {
    movie: PropTypes.shape({
        title: PropTypes.string.isRequired,
        year: PropTypes.number,
        poster: PropTypes.string,
    }).isRequired,
};

export default MovieCard;