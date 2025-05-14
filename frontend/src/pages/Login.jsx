import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Invalid server response format");
      }

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem('token', data.token);
        onLogin(); // update login state in App

        // NEW: Save the role from backend
        localStorage.setItem('role', data.role); // <-- Add this

        // Redirect admin or user
        if (data.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }

    } catch (error) {
      console.error('Login error:', error);
      alert('Something went wrong while connecting to the server. See console for details.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '2rem auto' }}>
      <h2>Login</h2>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        type="email"
        required
        style={{ width: '100%', padding: '10px', marginBottom: '1rem' }}
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        type="password"
        required
        style={{ width: '100%', padding: '10px', marginBottom: '1rem' }}
      />
      <button type="submit" style={{ padding: '10px 20px' }}>Login</button>
    </form>
  );
};

export default Login;

