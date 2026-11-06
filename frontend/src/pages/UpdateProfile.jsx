import { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { songcontext } from "../Wrapper.jsx";
import axios from "../APi/axiosConfig";


const UpdateProfile = () => {
  const { userData, setuserData } = useContext(songcontext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Set existing user details
  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
      });
    }
  }, [userData]);

  // Handle input changes
  const HandleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // Update profile
  const HandleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.name.trim() || !formData.email.trim()) {
      setError("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.put(
        "/auth/update-profile",
        {
          name: formData.name.trim(),
          email: formData.email.trim(),
        },
        {
          withCredentials: true,
        }
      );

      // Update global user state
      const updatedUser =
        response.data.user || response.data;

      setuserData(updatedUser);

      setSuccess("Profile updated successfully!");

      setTimeout(() => {
        navigate("/profile");
      }, 1200);

    } catch (err) {
      console.error("Profile update error:", err);

      setError(
        err.response?.data?.message ||
        "Unable to update profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!userData) {
    return (
      <div className="update-profile-message">
        <i className="ri-user-unfollow-line"></i>
        <h2>Profile unavailable</h2>
        <p>Please login to update your profile.</p>
        <Link to="/login">Login</Link>
      </div>
    );
  }

  return (
    <div className="update-profile-page">
      <div className="update-profile-container">

        {/* Header */}
        <div className="update-profile-header">
          <div>
            <span className="update-profile-eyebrow">
              <i className="ri-settings-3-line"></i>
              ACCOUNT SETTINGS
            </span>

            <h1>Edit Profile</h1>

            <p>
              Update your personal information and keep
              your account up to date.
            </p>
          </div>

          <div className="update-header-icon">
            <i className="ri-user-settings-line"></i>
          </div>
        </div>

        {/* Profile Card */}
        <div className="update-profile-card">

          {/* Avatar */}
          <div className="update-avatar-section">
            <div className="update-avatar">
              {formData.name
                .trim()
                .split(/\s+/)
                .map((word) => word[0])
                .join("")
                .slice(0, 2)
                .toUpperCase() || (
                  <i className="ri-user-3-fill"></i>
                )}
            </div>

            <div>
              <h3>{formData.name || "Your Name"}</h3>
              <p>Music Lover</p>
            </div>
          </div>

          <div className="update-divider"></div>

          {/* Form */}
          <form onSubmit={HandleSubmit}>

            <div className="update-form-heading">
              <h2>Personal Information</h2>
              <p>Make changes to your account details.</p>
            </div>

            {/* Name */}
            <div className="update-form-group">
              <label htmlFor="name">
                Full Name
              </label>

              <div className="update-input-wrapper">
                <i className="ri-user-line"></i>

                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={HandleChange}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="update-form-group">
              <label htmlFor="email">
                Email Address
              </label>

              <div className="update-input-wrapper">
                <i className="ri-mail-line"></i>

                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={HandleChange}
                  required
                />
              </div>
            </div>

            {/* Account Role */}
            <div className="update-form-group">
              <label>Account Type</label>

              <div className="update-input-wrapper update-readonly">
                <i className="ri-shield-user-line"></i>

                <input
                  type="text"
                  value={userData.IsAdmin ? "Administrator" : "Regular User"}
                  readOnly
                />

                <i className="ri-lock-line update-lock"></i>
              </div>

              <span className="update-input-hint">
                Account permissions cannot be changed here.
              </span>
            </div>

            {/* Messages */}
            {error && (
              <div className="update-alert update-error">
                <i className="ri-error-warning-line"></i>
                {error}
              </div>
            )}

            {success && (
              <div className="update-alert update-success">
                <i className="ri-checkbox-circle-line"></i>
                {success}
              </div>
            )}

            {/* Buttons */}
            <div className="update-form-actions">

              <button
                type="button"
                className="update-cancel-btn"
                onClick={() => navigate("/profile")}
                disabled={loading}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="update-save-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <i className="ri-loader-4-line update-spinner"></i>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="ri-save-line"></i>
                    Save Changes
                  </>
                )}
              </button>

            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="update-profile-footer">
          <i className="ri-shield-check-line"></i>
          Your account information is securely managed.
        </div>

      </div>
    </div>
  );
};

export default UpdateProfile;