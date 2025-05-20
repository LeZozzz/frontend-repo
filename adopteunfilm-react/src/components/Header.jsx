import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/adopteunfilm_rose.png';
import logotitre from '../assets/logotitre_rose.png';
import { motion } from 'framer-motion';
import '../styles/Header.css'; // Assuming you have a CSS file for styling

const Header = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('username');
        localStorage.removeItem('userId');
        navigate('/');
    };

    return (
        <motion.header
            className="header-container"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="logo-wrapper">
                <a href="/">
                    <img src={logo} alt="Logo" className="logo" />
                </a>
                <a href="/">
                    <img src={logotitre} alt="Titre" className="logo-second" />
                </a>
            </div>

            <form id="search-form">
                <input type="text" id="search-input" placeholder="🔍 Rechercher un film..." autoComplete="off" />
                <button type="submit" className="btn-glow">Rechercher</button>
            </form>

            <div className="header-actions">
                <button
                    className="btn-glow logout-btn"
                    onClick={() => navigate('/login')}
                >
                    Connexion
                </button>
            </div>
        </motion.header>
    );
};

export default Header;
