import React, { useState, useEffect, useCallback } from 'react';
import '../styles/login.css'; // Import the original CSS
import logoImage from '../assets/logo.png'; // Import the logo image

// FontAwesome imports (assuming it's installed via npm or included globally)
import '@fortawesome/fontawesome-free/css/all.min.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [gridCells, setGridCells] = useState([]);

    // Generate grid background
    const generateGrid = useCallback(() => {
        const totalCells = 380;
        const highlights = [9, 19, 46, 90, 125, 156, 200, 210, 232, 256, 266, 289, 302, 311, 15, 20, 121, 23, 49, 5, 5, 70, 104, 137, 168, 184, 223, 245, 351];
        const shadows = [13, 42, 58, 81, 118, 143, 150, 181, 196, 219, 228, 262, 294, 306, 325, 360, 373];

        const cells = [];
        for (let i = 0; i < totalCells; i++) {
            let className = 'grid-cell';
            if (highlights.includes(i)) {
                className += ' highlight';
            } else if (shadows.includes(i)) {
                className += ' shadow';
            }
            cells.push(<div key={i} className={className}></div>);
        }
        return cells;
    }, []);

    useEffect(() => {
        setGridCells(generateGrid());
    }, [generateGrid]);

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Login attempt:', { email, password, remember });
        alert('Login functionality would be implemented here!\n\nEmail: ' + email);
    };

    const signInWithGoogle = () => {
        alert('Google Sign-In would be implemented here!');
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(prev => !prev);
    };

    return (

    <div className="LoginPage"> {/* This div acts as a container for the whole page if needed */}
        {/* Grid Background Pattern */}
        <div className="grid-background" id="gridBackground">
            {gridCells}
        </div>

        <div className="main-container">
            <div className="auth-wrapper">
                {/* Left Side - Description */}
                <div className="left-side">
                    <div className="content-wrapper">
                        <div className="logo">
                            <div className="logo-icon">
                                <img src={logoImage} alt="HireHelper Logo" className="logo-image" />
                            </div>
                            <div className="logo-name">
                                <h1>Welcome to <span className="brand-name">HireHelper</span></h1>
                            </div>
                        </div>

                        <div className="tagline">
                            Your trusted task management platform
                        </div>

                        <div className="description">
                            Connect with skilled professionals and get your tasks done efficiently. <br />
                            Whether you need help with home repairs, deliveries, or any other service, <br />
                            we've got you covered with verified and trusted helpers.
                        </div>

                        <ul className="features">
                            <li>
                                <span className="check-icon">✓</span>
                                <span>Post tasks and receive instant help requests</span>
                            </li>
                            <li>
                                <span className="check-icon">✓</span>
                                <span>Browse available tasks and offer your skills</span>
                            </li>
                            <li>
                                <span className="check-icon">✓</span>
                                <span>Secure payments and ratings system</span>
                            </li>
                            <li>
                                <span className="check-icon">✓</span>
                                <span>Real-time notifications and updates</span>
                            </li>
                            <li>
                                <span className="check-icon">✓</span>
                                <span>24/7 customer support</span>
                            </li>
                        </ul>
                    </div>
                </div>



                {/* Login Form */}
                <div className="login-container">
                    <div className="header">
                        <h1><span className="brand-name">Login</span></h1>
                        <p>Please enter your details to get started</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                           <label htmlFor="email">Email</label>
                            <input
                                type="email" id="email" placeholder="Enter your email" required value={email} onChange={(e) => setEmail(e.target.value)}/>

                        </div>

                        <div className="form-group password-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type={passwordVisible ? 'text' : 'password'} id="password" placeholder="••••••••" required value={password} onChange={(e) => setPassword(e.target.value)}/>
                            <button
                                type="button" className="pw-toggle" aria-label="Toggle password visibility" onClick={togglePasswordVisibility}
                            >
                                <i className={passwordVisible ? 'fa fa-eye' : 'fa fa-eye-slash'}></i>
                            </button>
                        </div>

                        <div className="form-options">
                            <label className="remember-me">
                                <input type="checkbox" id="remember" checked={remember} onChange={(e) => setRemember(e.target.checked)}/>
                                <span>Remember me</span>
                            </label>
                            <a href="#" className="forgot-password">Forgot password?</a>
                        </div>

                        <button type="submit" className="btn-signin">Sign in</button>

                        <div className="divider">
                            <span>Or</span>
                        </div>

                        <button type="button" className="btn-google" onClick={signInWithGoogle}>
                            <svg className="google-icon" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>

                            Sign in with Google
                        </button>

                        <div className="signup-link">
                            Don't have an account? <a href="#">Sign up</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

);  
};

export default LoginPage;