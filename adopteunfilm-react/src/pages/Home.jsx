import React from 'react';
import { motion } from 'framer-motion';
import '../styles/Home.css';

const Home = () => {
    return (
        <motion.div
            className="home-hero"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="home-hero-content">
                <h1>
                    Trouve ton <span className="highlight">match ciné parfait</span><br />
                </h1>
                <p className="home-desc">
                    Tape un titre ou un genre et découvre des recommandations personnalisées !
                </p>
                <form className="home-search">
                    <input type="text" placeholder="Rechercher un film ou un genre..." />
                    <button type="submit">Découvrir</button>
                </form>
                <div className="home-quicktags">
                    <span>Action</span>
                    <span>Comédie</span>
                    <span>Drame</span>
                    <span>Animation</span>
                    <span>Science-fiction</span>
                </div>
            </div>
        </motion.div>
    );
};

export default Home;
