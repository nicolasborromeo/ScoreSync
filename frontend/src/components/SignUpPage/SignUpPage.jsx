import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { signup } from '../../store/session';
import { useNavigate } from 'react-router-dom';

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
            setErrorMessage({password: 'Passwords do not match'});
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
                <h2>Sign Up</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>First Name</label>
                        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
                    </div>
                    <div className="input-group">
                        <label>Last Name</label>
                        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
                    </div>
                    <div className="input-group">
                        <label>Username</label>
                        <input type="text" name="username" value={formData.username} onChange={handleChange} />
                    </div>
                    {errorMessage.username && <p className="error-message">{errorMessage.username}</p>}
                    <div className="input-group">
                        <label>Email</label>
                        <input type="text" name="email" value={formData.email} onChange={handleChange} />
                    </div>
                    {errorMessage.email && <p className="error-message">{errorMessage.email}</p>}
                    <div className="input-group">
                        <label>Password</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} />
                    </div>
                    <div className="input-group">
                        <label>Confirm Password</label>
                        <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
                    </div>
                    {errorMessage.password && <p className="error-message">{errorMessage.password}</p>}
                    <button type="submit" className="login-button">Sign Up</button>
                </form>
                <div className="register-link">
                    <p>Already have an account?</p>
                    <a href="/">Log In</a>
                </div>
            </div>
        </div>
    );
}
