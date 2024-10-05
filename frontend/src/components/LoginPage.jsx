import { useState } from 'react';
import './Login.css'; // You can add your styles here

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your login logic here
    if (!email || !password) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    // Example login logic (replace with your API call)
    console.log('Logging in with:', { email, password });
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-button">Login</button>
      </form>
      <p className="register-link">
        Don&apos;t have an account? <a href="/register">Register here</a>
      </p>
    </div>
  );
};

export default LoginPage;
