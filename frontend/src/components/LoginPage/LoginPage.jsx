import { useState } from 'react';
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { login } from '../../store/session'
import './Login.css';
import { CgMusicNote } from "react-icons/cg";

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

  const handleLoginDemoUser = () => {
    dispatch(login({ credential:'nicoborro', password:'password'})).then(()=> navigate('/dashboard'))
  }

  return (
    <div className='login-parent-container'>
      <div className="login-container">
        <h2 className="logo" style={{margin:'10px auto 10px', fontSize:'1.5em'}}><CgMusicNote size={45}/></h2>
        <h2 style={{fontWeight:'700', fontSize:'1.2em',margin:'0 auto 30px'}} className="logo">SCORE SYNC</h2>
        <p style={{fontSize:'0.9em', margin:'0 auto 35px'}}>Log in to your account to start creating.</p>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="credential">
              <input
                placeholder='Username or email address*'
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
                placeholder='Password*'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </label>
            {errorMessage?.credential && <p className="error-message">{errorMessage.credential}</p>}
          </div>
          <button type="submit" className="login-button">Continue</button>
        </form>
        <p className="register-link">
          <span>Don&apos;t have an account?</span>
          <div>
          <a href="/signup">Sign up</a> <span>or <a><span style={{textDecoration:'underline', cursor:'pointer'}} onClick={handleLoginDemoUser}> log in as  Demo User</span></a></span>
          </div>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
