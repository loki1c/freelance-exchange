import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from './components/Login';
import Registration from './components/Registration';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';

const App = () => {
  return (
    <Router>
      <header style={styles.header}>
        <h1 style={styles.logo}>Freelance Exchange</h1>
        <nav style={styles.nav}>
          <Link to="/" style={styles.navLink}>Вход</Link>
          <Link to="/registration" style={styles.navLink}>Регистрация</Link>
        </nav>
      </header>
      <main style={styles.main}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </Router>
  );
};

// Стили в объекте
const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    margin: 0,
  },
  nav: {
    display: 'flex',
    gap: '10px',
  },
  navLink: {
    color: '#fff',
    textDecoration: 'none',
    padding: '5px 10px',
    backgroundColor: '#0056b3',
    borderRadius: '5px',
    transition: 'background-color 0.3s',
  },
  navLinkHover: {
    backgroundColor: '#003f7f',
  },
  main: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
};

export default App;
