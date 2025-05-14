import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ isLoggedIn, onLogout }) => {
  const navigate = useNavigate();

  // State to manage the theme
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle theme between dark and light mode
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Persist the theme preference in localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }
  }, []);

  useEffect(() => {
    // Set the theme in localStorage and apply it to the body element
    if (isDarkMode) {
      localStorage.setItem('theme', 'dark');
      document.body.classList.add('dark-mode');
    } else {
      localStorage.setItem('theme', 'light');
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    onLogout(); // Callback to update the logged-in state in parent component
    navigate('/login'); // Redirect to login page
  };

  return (
    <header className="main-header">
      <h1 className="logo">MyBlogSite</h1>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/lifestyle">Lifestyle</Link>
        {isLoggedIn ? (
          <>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
        <button className="dark-mode-toggle" onClick={toggleTheme}>
          {isDarkMode ? '🌞' : '🌙'} {/* Change icon based on the theme */}
        </button>
      </nav>
    </header>
  );
};

export default Header;
