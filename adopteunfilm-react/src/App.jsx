import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import MySpace from './pages/MySpace';
import Login from './pages/Login';
import Search from './pages/Search';
import Details from './pages/Details';
import './styles/styles.css';

const Layout = ({ children }) => {
    const location = useLocation();
    const isLogin = location.pathname === '/login';

    return (
        <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {!isLogin && <Header />}
            <main style={{ flex: 1 }}>{children}</main>
            {!isLogin && <Footer />}
        </div>
    );
};

const App = () => {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/my-space" element={<MySpace />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/details/:id" element={<Details />} />
                </Routes>
            </Layout>
        </Router>
    );
};

export default App;
