
import { useContext, useEffect } from "react";
import { songcontext } from "../Wrapper.jsx";
import "./MoodSongs.css";

const MoodSongs = () => {
  const {
    Songs = [],
    setCurrentPlaylistSongs,
    currentPlaylistSongs = [],
    currentIndex,
    setCurrentIndex,
    isPlaying,
    setIsPlaying,
  } = useContext(songcontext);

  // Play / Pause song
  const HandlePlay = (song, idx) => {

    const currentSong = currentPlaylistSongs[currentIndex];

    // Same song click -> Pause
    if (
      currentSong?._id === song._id &&
      isPlaying
    ) {
      setIsPlaying(false);
      return;
    }

    // New song or paused song -> Play
    setCurrentPlaylistSongs(Songs);
    setCurrentIndex(idx);
    setIsPlaying(true);
  };

  // Check whether selected song is currently playing
  const isSongPlaying = (song) => {
    const currentSong = currentPlaylistSongs[currentIndex];

    return (
      currentSong?._id === song._id &&
      isPlaying
    );
  };

  return (
    <section className="mood-song-section">

      <div className="mood-song-heading">
        <div>
          <span className="mood-song-eyebrow">
            <i className="ri-sparkling-2-fill"></i>
            PERSONALIZED FOR YOU
          </span>

          <h2>Recommended Songs</h2>

          <p>
            A collection inspired by your current expression.
          </p>
        </div>

        <div className="mood-song-ai-badge">
          <i className="ri-sparkling-2-line"></i>
          AI PICKS
        </div>
      </div>

      <div className="mood-song-list">

        {Songs.length > 0 ? (

          Songs.map((song, idx) => {

            const isCurrentSong = isSongPlaying(song);

            return (
              <div
                className={`mood-song-card ${
                  isCurrentSong
                    ? "mood-song-card-active"
                    : ""
                }`}
                key={song._id || song.id || idx}
              >

                {/* Number */}
                <div className="mood-song-number">
                  {String(idx + 1).padStart(2, "0")}
                </div>

                {/* Cover */}
                <div className="mood-song-cover">
                  {song.image ? (
                    <img
                      src={song.image}
                      alt={song.title || "Song cover"}
                    />
                  ) : (
                    <i className="ri-music-2-fill"></i>
                  )}
                </div>

                {/* Song information */}
                <div className="mood-song-details">
                  <h3>
                    {song.title || "Untitled Song"}
                  </h3>

                  <p>
                    {song.artist || "Unknown Artist"}
                  </p>
                </div>

                {/* Action */}
                <div className="mood-song-action">

                  {isCurrentSong && (
                    <span className="mood-playing-label">
                      <span className="playing-dot"></span>
                      Playing
                    </span>
                  )}

                  <button
                    onClick={() => HandlePlay(song, idx)}
                    className="mood-song-play-button"
                    aria-label={
                      isCurrentSong
                        ? `Pause ${song.title}`
                        : `Play ${song.title}`
                    }
                  >
                    <i
                      className={
                        isCurrentSong
                          ? "ri-pause-fill"
                          : "ri-play-fill"
                      }
                    ></i>
                  </button>

                </div>

              </div>
            );
          })

        ) : (

          <div className="mood-song-empty">

            <div className="empty-music-icon">
              <i className="ri-music-2-line"></i>
            </div>

            <h3>No recommendations yet</h3>

            <p>
              Start the camera and detect your expression
              to discover personalized music.
            </p>

          </div>

        )}

      </div>
    </section>
  );
};

export default MoodSongs;
