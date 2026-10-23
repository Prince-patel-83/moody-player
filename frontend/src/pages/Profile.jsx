
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import axios from "../APi/axiosConfig";
import "./Profile.css";

function Profile() {
  const [user, setUser] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get("/api/auth/me");
        const data = response.data;

        if (!data?.user) {
          throw new Error("Profile information was not returned.");
        }

        if (!cancelled) {
          setUser(data.user);
          setPlaylists(data.playlists || []);
        }
      } catch (err) {
        console.error(err);

        if (!cancelled) {
          setError(
            err.response?.data?.message ||
            err.message ||
            "Unable to load your profile."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  const totalSongs = playlists.reduce(
    (total, playlist) =>
      total + (playlist.songs?.length || 0),
    0
  );

  const initials = user?.name
    ?.trim()
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(
        "en-IN",
        {
          month: "short",
          year: "numeric",
        }
      )
    : "Not available";

  if (loading) {
    return (
      <div className="profile-message">
        <i className="ri-loader-4-line"></i>
        Loading your profile...
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="profile-message">
        <div className="profile-error-card">
          <i className="ri-user-unfollow-line"></i>
          <h2>Profile unavailable</h2>
          <p>{error || "User not found."}</p>

          <button
            className="profile-primary-btn"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const favoriteMood =
    playlists.length && playlists[0]?.mood
      ? playlists[0].mood
      : "None";

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

          <button
            className="edit-btn"
            onClick={() =>
              console.log("Edit profile clicked")
            }
          >
            <i className="ri-edit-line"></i>
            Edit Profile
          </button>
        </div>

        {/* User information */}

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

              <h2>{user.name || "Music Lover"}</h2>

              <p>{user.email || "No email available"}</p>

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

          <div className="stat-card">
            <div className="stat-icon stat-icon-amber">
              <i className="ri-music-2-fill"></i>
            </div>

            <div>
              <p>Total Songs</p>
              <h2>{totalSongs}</h2>
            </div>
          </div>

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

        {/* Playlist collection */}

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

            <Link
              to="/playlists"
              className="view-all"
            >
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

              <Link
                to="/playlists"
                className="create-btn"
              >
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
                    aria-label={`Open ${
                      playlist.name || "playlist"
                    }`}
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