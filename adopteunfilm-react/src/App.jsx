import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import MySpace from './pages/MySpace';
import './styles/styles.css';

const App = () => {
    return (
        <Router>
            <div>
                <Header />
                <Switch>
                    <Route path="/" exact component={Home} />
                    <Route path="/my-space" component={MySpace} />
                </Switch>
                <Footer />
            </div>
        </Router>
    );
};

export default App;