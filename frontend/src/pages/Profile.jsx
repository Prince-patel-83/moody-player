
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { songcontext } from "../Wrapper.jsx";
import axios from "../APi/axiosConfig";
import "./Profile.css";

function Profile() {
  const {
    userData,
    playlists = [],
    setuserData,
    setPlaylists,
  } = useContext(songcontext);

  const navigate = useNavigate();

  // Logout
  const HandleLogout = async () => {
    try {
      const response = await axios.get("/api/auth/logout", {
        withCredentials: true,
      });

      if (response.status === 200) {
        setuserData(null);
        setPlaylists([]);
        navigate("/login", { replace: true });
      }
    } catch (error) {
      console.error(
        "Logout Error:",
        error.response?.data || error.message
      );
    }
  };

  // Total songs
  const totalSongs = playlists.reduce(
    (total, playlist) =>
      total + (playlist.songs?.length || 0),
    0
  );

  // User initials
  const initials = userData?.name
    ?.trim()
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const UpdateProfile = () => {
    navigate("/update-profile");
  };

  // Member since
  const memberSince = userData?.createdAt
    ? new Date(userData.createdAt).toLocaleDateString(
        "en-IN",
        {
          month: "short",
          year: "numeric",
        }
      )
    : "Not available";

  // Favorite mood
  const favoriteMood =
    playlists.length > 0 && playlists[0]?.mood
      ? playlists[0].mood
      : "None";

  // User not available
  if (!userData) {
    return (
      <div className="profile-message">
        <div className="profile-error-card">
          <i className="ri-user-unfollow-line"></i>
          <h2>Profile unavailable</h2>
          <p>Please login to view your profile.</p>

          <Link to="/login" className="profile-primary-btn">
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <main className="profile-container">

        {/* Heading */}
        <div className="profile-heading">
          <div>
            <p className="profile-eyebrow">
              <i className="ri-user-smile-line"></i>
              YOUR ACCOUNT
            </p>

            <h1>My Profile</h1>

            <p className="profile-subtitle">
              Your music, your moods, your space.
            </p>
          </div>

          <div className="profile-actions">
            <button
              className="edit-btn"
              onClick={UpdateProfile}
            >
              <i className="ri-edit-line"></i>
              Edit Profile
            </button>

            <button
              className="logout-btn"
              onClick={HandleLogout}
            >
              <i className="ri-logout-box-r-line"></i>
              Logout
            </button>
          </div>
        </div>

        {/* User Information */}
        <section className="profile-card">
          <div className="profile-user">
            <div className="avatar">
              {initials || (
                <i className="ri-user-3-fill"></i>
              )}
            </div>

            <div className="user-details">
              <span className="profile-welcome">
                WELCOME BACK
              </span>

              <h2>{userData.name || "Music Lover"}</h2>

              <p>
                {userData.email || "No email available"}
              </p>

              <span className="member-badge">
                <i className="ri-music-2-fill"></i>
                Music Lover
              </span>
            </div>
          </div>

          <div className="profile-meta">
            <div className="profile-meta-icon">
              <i className="ri-calendar-check-line"></i>
            </div>

            <p>Member since</p>
            <strong>{memberSince}</strong>
          </div>
        </section>

        {/* Statistics */}
        <section className="stats-grid">

          <div className="stat-card">
            <div className="stat-icon stat-icon-green">
              <i className="ri-play-list-2-fill"></i>
            </div>

            <div>
              <p>Total Playlists</p>
              <h2>{playlists.length}</h2>
            </div>
          </div>

          {userData.IsAdmin && (
            <div className="stat-card">
              <div className="stat-icon stat-icon-amber">
                <i className="ri-music-2-fill"></i>
              </div>

              <div>
                <p>Total Songs</p>
                <h2>{totalSongs}</h2>
              </div>
            </div>
          )}

          <div className="stat-card">
            <div className="stat-icon stat-icon-orange">
              <i className="ri-heart-3-fill"></i>
            </div>

            <div>
              <p>Favorite Mood</p>
              <h2 className="mood-stat">
                {favoriteMood}
              </h2>
            </div>
          </div>

        </section>

        {/* Playlist Collection */}
        <section className="playlist-section">

          <div className="section-heading">
            <div>
              <p className="profile-eyebrow">
                YOUR COLLECTION
              </p>

              <h2>My Songs</h2>

              <p className="playlist-subtitle">
                All the music you've collected in one place.
              </p>
            </div>

            <Link to="/playlists" className="view-all">
              View All
              <i className="ri-arrow-right-line"></i>
            </Link>
          </div>

          {playlists.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <i className="ri-music-2-line"></i>
              </div>

              <h3>Your collection starts here</h3>

              <p>
                Create your first playlist and give
                your mood a soundtrack.
              </p>

              <Link to="/playlists" className="create-btn">
                <i className="ri-add-line"></i>
                Explore Playlists
              </Link>
            </div>
          ) : (
            <div className="playlist-grid">

              {playlists.map((playlist) => (
                <div
                  className="playlist-card"
                  key={playlist._id}
                >
                  <div className="playlist-cover">
                    <div className="playlist-cover-icon">
                      <i className="ri-music-2-fill"></i>
                    </div>

                    <span className="cover-mood">
                      {playlist.mood || "Mixed"}
                    </span>
                  </div>

                  <div className="playlist-info">
                    <h3>
                      {playlist.name || "My Playlist"}
                    </h3>

                    <p>
                      {playlist.songs?.length || 0} songs
                    </p>

                    <span className="mood-tag">
                      <i className="ri-sparkling-2-line"></i>
                      {playlist.mood || "Mixed"}
                    </span>
                  </div>

                  <Link
                    to={`/playlists/${playlist._id}`}
                    className="playlist-open"
                    aria-label={`Open ${playlist.name || "playlist"}`}
                  >
                    <i className="ri-arrow-up-right-line"></i>
                  </Link>
                </div>
              ))}

            </div>
          )}

        </section>
      </main>
    </div>
  );
}

export default Profile;
