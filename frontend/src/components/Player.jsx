import { useContext, useEffect, useState } from "react";
import { songcontext } from "../Wrapper";
import "./Player.css";

const Player = () => {
  const {
    currentPlaylistSongs = [],
    currentIndex,
    setCurrentIndex,
    isPlaying,
    setIsPlaying,
    audioRef,
  } = useContext(songcontext);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioError, setAudioError] = useState("");

  const currentSong = currentPlaylistSongs[currentIndex];

  // Load selected song
  useEffect(() => {
    const audio = audioRef?.current;

    if (!audio) return;

    if (!currentSong?.audio) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();

      setCurrentTime(0);
      setDuration(0);
      setAudioError("Audio URL not available");

      return;
    }

    audio.pause();

    setAudioError("");
    setCurrentTime(0);
    setDuration(0);

    // Backend song object uses audio property
    audio.src = currentSong.audio;
    audio.load();

  }, [currentSong, audioRef]);

  // Handle play and pause
  useEffect(() => {
    const audio = audioRef?.current;

    if (!audio || !currentSong?.audio) return;

    if (isPlaying) {
      audio.play().catch((error) => {
        console.error("Audio play error:", error);
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }

  }, [isPlaying, currentSong, audioRef, setIsPlaying]);

  // Toggle play/pause
  const togglePlay = () => {
    if (!currentSong?.audio) {
      console.log("Audio URL missing:", currentSong);
      return;
    }

    setIsPlaying((prev) => !prev);
  };

  // Next song
  const nextSong = () => {
    if (!currentPlaylistSongs.length) return;

    const nextIndex =
      (currentIndex + 1) % currentPlaylistSongs.length;

    setCurrentIndex(nextIndex);
    setIsPlaying(true);
  };

  // Previous song
  const previousSong = () => {
    if (!currentPlaylistSongs.length) return;

    const previousIndex =
      (currentIndex - 1 + currentPlaylistSongs.length) %
      currentPlaylistSongs.length;

    setCurrentIndex(previousIndex);
    setIsPlaying(true);
  };

  // Audio time update
  const handleTimeUpdate = () => {
    const audio = audioRef?.current;
    if (!audio) return;

    setCurrentTime(audio.currentTime);
  };

  // Audio metadata loaded
  const handleLoadedMetadata = () => {
    const audio = audioRef?.current;
    if (!audio) return;

    setDuration(audio.duration || 0);
  };

  // When song finishes
  const handleEnded = () => {
    nextSong();
  };

  // Seek song
  const handleProgressChange = (e) => {
    const audio = audioRef?.current;
    if (!audio) return;

    const value = Number(e.target.value);

    audio.currentTime = value;
    setCurrentTime(value);
  };

  // Audio loading error
  const handleAudioError = () => {
    const audio = audioRef?.current;

    console.error("Audio source error:", {
      url: currentSong?.audio,
      errorCode: audio?.error?.code,
      errorMessage: audio?.error?.message,
    });

    setAudioError("Unable to load this song");
    setIsPlaying(false);
  };

  // Format time
  const formatTime = (time) => {
    if (!Number.isFinite(time)) return "0:00";

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Don't show player if no song selected
  if (!currentSong) return null;

  return (
    <footer className="player">

      <audio
        ref={audioRef}
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onError={handleAudioError}
      />

      {/* Song Information */}
      <div className="player-song">

        {/* <img
          src={currentSong.image || "/default-song.png"}
          alt={currentSong.title || "Song"}
          className="player-song-image"
        /> */}

        <div className="player-song-info">
          <h4>{currentSong.title}</h4>
          <p>{currentSong.artist}</p>
          {audioError && (
            <small className="audio-error">{audioError}</small>
          )}
        </div>

      </div>

      {/* Player Controls */}
      <div className="player-center">

        <div className="player-controls">

          <button
            className="player-control"
            onClick={previousSong}
            title="Previous"
          >
            <i className="ri-skip-back-fill"></i>
          </button>

          <button
            className="player-play"
            onClick={togglePlay}
            title={isPlaying ? "Pause" : "Play"}
          >
            <i
              className={
                isPlaying
                  ? "ri-pause-fill"
                  : "ri-play-fill"
              }
            ></i>
          </button>

          <button
            className="player-control"
            onClick={nextSong}
            title="Next"
          >
            <i className="ri-skip-forward-fill"></i>
          </button>

        </div>

        {/* Progress Bar */}
        <div className="player-progress">

          <span>{formatTime(currentTime)}</span>

          <input
            type="range"
            min="0"
            max={duration || 0}
            step="0.1"
            value={Math.min(currentTime, duration || 0)}
            onChange={handleProgressChange}
            disabled={!duration}
          />

          <span>{formatTime(duration)}</span>

        </div>

      </div>

    </footer>
  );
};

export default Player;
