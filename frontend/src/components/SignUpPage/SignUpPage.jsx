import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { signup } from '../../store/session';
import { useNavigate } from 'react-router-dom';
import { CgMusicNote } from "react-icons/cg";

export default function SignUpPage() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errorMessage, setErrorMessage] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setErrorMessage({ password: 'Passwords do not match' });
        } else {
            setErrorMessage({});
            try {
                const res = await dispatch(signup(formData))
                if (res.ok) navigate('/dashboard')
            } catch (error) {
                const err = await error.json()
                setErrorMessage(err.errors)
            }
        }
    };

    return (
        <div className="login-parent-container">
            <div className="login-container">
            <h2 className="logo" style={{margin:'10px auto 10px', fontSize:'1.5em'}}><CgMusicNote size={45}/></h2>
            <h2 style={{fontWeight:'700', fontSize:'1.2em',margin:'0 auto 25px'}} className="logo">SCORE SYNC</h2>
            <p style={{fontSize:'0.9em', margin:'0 auto 20px'}}>Create an account to share your music.</p>
                <form onSubmit={handleSubmit}>
                    {/* <div className='first-last-name-inputs'>
                        <div className="input-group">
                            <input type="text" name="firstName" placeholder='First Name' value={formData.firstName} onChange={handleChange} />
                        </div>
                        <div className="input-group">
                            <input type="text" name="lastName" placeholder='Last Name' value={formData.lastName} onChange={handleChange} />
                        </div>
                    </div> */}
                    <div className="input-group">
                        <input type="text" name="username" placeholder='Username*' value={formData.username} onChange={handleChange} />
                    </div>
                    {errorMessage.username && <p className="error-message">{errorMessage.username}</p>}
                    <div className="input-group">
                        {/* <label>Email</label> */}
                        <input type="text" name="email" placeholder="Email*" value={formData.email} onChange={handleChange} />
                    </div>
                    {errorMessage.email && <p className="error-message">{errorMessage.email}</p>}
                    <div className="input-group">
                        {/* <label>Password</label> */}
                        <input type="password" name="password" placeholder='Password*' value={formData.password} onChange={handleChange} />
                    </div>
                    <div className="input-group">
                        {/* <label>Confirm Password</label> */}
                        <input type="password" name="confirmPassword" placeholder='Confirm Password*' value={formData.confirmPassword} onChange={handleChange} />
                    </div>
                    {errorMessage.password && <p className="error-message">{errorMessage.password}</p>}
                    <button type="submit" className="login-button">Continue</button>
                </form>
                <div className="register-link">
                    <span style={{textAlign:'center'}}>Already have an account? <a style={{marginLeft:'7px'}} href="/">Log In</a></span>
                </div>
            </div>
        </div>
    );
}
