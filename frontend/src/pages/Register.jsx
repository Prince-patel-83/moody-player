import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { asyncRegisterUser } from "../store/userAction";
import "./login.css";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    console.log("Register Data:", formData);

    try {

      const res = await asyncRegisterUser(formData);
      
      if (res) {
        navigate("/login");
      }

    } catch (error) {
      console.error("Registration failed:", error);
    }

  };

  return (
    <div className="auth-register-page">

      {/* <div className="auth-register-background">
        <div className="auth-register-glow auth-register-glow-one"></div>
        <div className="auth-register-glow auth-register-glow-two"></div>
      </div> */}

      <div className="auth-register-container">

        <div className="auth-register-brand">
          <div className="auth-register-logo">
            <i className="ri-headphone-fill"></i>
          </div>

          <span>Moody Player</span>
        </div>

        <div className="auth-register-card">

          <div className="auth-register-header">
            <span className="auth-register-eyebrow">
              JOIN THE EXPERIENCE
            </span>

            <h1>Create account</h1>

            <p>
              Create your account and discover music made for your mood.
            </p>
          </div>


          <form
            onSubmit={handleSubmit}
            className="auth-register-form"
          >
            <div className="auth-register-field">
              <label>Are you an artist or a listener?</label>

              <div className="auth-register-role-options">
                <label>
                  <input
                    type="radio"
                    name="IsUser"
                    value="artist"
                    checked={formData.IsUser === "artist"}
                    onChange={handleChange}
                    required
                  />
                  Artist
                </label>

                <label>
                  <input
                    type="radio"
                    name="IsUser"
                    value="listener"
                    checked={formData.IsUser === "listener"}
                    onChange={handleChange}
                  />
                  Listener
                </label>
              </div>
            </div>


            <div className="auth-register-field">

              <label>Full Name</label>

              <div className="auth-register-input-wrapper">
                <i className="ri-user-line"></i>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="auth-register-field">
              <label>Email</label>

              <div className="auth-register-input-wrapper">
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

            <div className="auth-register-field">
              <label>Password</label>

              <div className="auth-register-input-wrapper">
                <i className="ri-lock-line"></i>

                <input
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="auth-register-field">
              <label>Confirm Password</label>

              <div className="auth-register-input-wrapper">
                <i className="ri-shield-check-line"></i>

                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="auth-register-submit"
            >
              <span>Create account</span>
              <i className="ri-arrow-right-line"></i>
            </button>

          </form>

          <div className="auth-register-divider">
            <span>OR</span>
          </div>

          <div className="auth-register-social">
            <button type="button">
              <i className="ri-google-fill"></i>
              Sign up with Google
            </button>
          </div>

          <div className="auth-register-login">
            <span>Already have an account?</span>

            <Link to="/login">
              Sign in
            </Link>
          </div>

        </div>

        <div className="auth-register-footer">
          <span>© 2026 Moody Player</span>
          <span>•</span>
          <span>Your mood. Your music.</span>
        </div>

      </div>
    </div>
  );
};

export default Register;