import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // State to hold error messages
  const [dashboard, setDashboard] = useState(false); // State for dashboard visibility
  const [isLoginMode, setIsLoginMode] = useState(true); // Toggle between Login and Register mode

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', { username, password });
      if (response.data.success) {
        setDashboard(true);
        setErrorMessage(''); // Clear any previous errors
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message); // Display the backend error message
      } else {
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/register', { username, password });
      if (response.data.success) {
        setIsRegistered(true);
        setErrorMessage(''); // Clear any previous errors
        alert('Registration successful! You can now log in.');
        setIsLoginMode(true); // Switch to login mode
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message); // Display the backend error message
      } else {
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/logout');
      setDashboard(false); // Redirect to login or home page after logout
      alert('Logged out successfully!');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (dashboard) {
    return (
      <div>
        <h1>Welcome to the Dashboard!</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>
    );
  }

  return (
    <div>
      <h1>{isLoginMode ? 'Login' : 'Register'}</h1>
      <form onSubmit={isLoginMode ? handleLogin : handleRegister}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">{isLoginMode ? 'Login' : 'Register'}</button>
      </form>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <p>
        {isLoginMode ? 'Don’t have an account?' : 'Already have an account?'}{' '}
        <button onClick={() => setIsLoginMode(!isLoginMode)}>
          {isLoginMode ? 'Register' : 'Login'}
        </button>
      </p>
    </div>
  );
}

export default App;
