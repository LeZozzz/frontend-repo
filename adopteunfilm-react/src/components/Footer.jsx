import React from 'react';
import { motion } from 'framer-motion';
import '../styles/Footer.css';

const Footer = () => {
    return (
        <motion.footer
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="footer"
        >
            <p>&copy; 2025 AdopteUnFilm</p>
        </motion.footer>
    );
};

export default Footer;