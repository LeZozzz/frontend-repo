import React from 'react';
import Header from '../components/Header';
import RecommendationsList from '../components/RecommendationsList';
import Footer from '../components/Footer';

const Home = () => {
    return (
        <div>
            <Header />
            <main>
                <section id="user-welcome">
                    <h2>Bienvenue dans votre espace, <span id="username-placeholder"></span> !</h2>
                    <RecommendationsList />
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default Home;