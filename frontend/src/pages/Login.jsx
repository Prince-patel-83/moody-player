import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login.css"
import { asyncLoginUser } from "../store/userAction";
import { songcontext } from "../Wrapper";
const Login = () => {

  const navigate = useNavigate();
  const {setuserData} = useContext(songcontext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Login Data:", formData);

    const user = await asyncLoginUser(formData);
    if(user){
        console.log("user details " , user);
        setuserData(user);
        navigate("/");
    }

  };


   return (
    <div className="auth-login-page">

      <div className="auth-login-background">
        <div className="auth-login-glow auth-login-glow-one"></div>
        <div className="auth-login-glow auth-login-glow-two"></div>
      </div>

      <div className="auth-login-container">

        <div className="auth-login-brand">
          <div className="auth-login-logo">
            <i className="ri-headphone-fill"></i>
          </div>

          <span>Moody Player</span>
        </div>

        <div className="auth-login-card">

          <div className="auth-login-header">
            <span className="auth-login-eyebrow">
              WELCOME BACK
            </span>

            <h1>Sign in</h1>

            <p>
              Continue your personalized music experience.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-login-form">

            <div className="auth-login-field">
              <label>Email</label>

              <div className="auth-login-input-wrapper">
                <i className="ri-mail-line"></i>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="auth-login-field">
              <div className="auth-login-password-label">
                <label>Password</label>

                <a href="#forgot">
                  Forgot password?
                </a>
              </div>

              <div className="auth-login-input-wrapper">
                <i className="ri-lock-line"></i>

                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="auth-login-submit"
            >
              <span>Sign in</span>
              <i className="ri-arrow-right-line"></i>
            </button>

          </form>

          <div className="auth-login-divider">
            <span>OR</span>
          </div>

          <div className="auth-login-social">
            <button type="button">
              <i className="ri-google-fill"></i>
              Continue with Google
            </button>
          </div>

          <div className="auth-login-register">
            <span>Don't have an account?</span>

            <Link to="/register">
              Create account
            </Link>
          </div>

        </div>

        <div className="auth-login-footer">
          <span>© 2026 Moody Player</span>
          <span>•</span>
          <span>Music that matches your mood</span>
        </div>

      </div>
    </div>
  );
}

export default Login