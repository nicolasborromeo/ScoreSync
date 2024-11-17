import { useState } from 'react';
import { useDispatch } from 'react-redux'
import { login } from '../../store/session'
import './Login.css';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await dispatch(login({ credential, password }))
      if (res.ok) navigate('/dashboard')
    } catch (error) {
      const err = await error.json()
      setErrorMessage(err.errors)
    }
  };

  return (
    <div className='login-parent-container'>
      <div className="login-container">
        <h2>Login</h2>
        {errorMessage?.credential && <p className="error-message">{errorMessage.credential}</p>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="credential">
              <input
                placeholder='Enter your username or email'
                id="credential"
                value={credential}
                onChange={(e) => setCredential(e.target.value)}
                required
                autoComplete="username"
              />
            </label>
          </div>
          <div className="input-group">
            <label htmlFor="password">
              <input
                type="password"
                id="password"
                placeholder='Enter your password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </label>
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
        <p className="register-link">
          <span>Don&apos;t have an account?</span>
          <a href="/signup">Sign up here</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
