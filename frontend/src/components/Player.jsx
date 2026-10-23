import { useContext, useEffect, useState } from "react";
import { songcontext } from "../Wrapper";
// import "./Player.css";

const Player = () => {
  const {
    currentPlaylistSongs,
    currentIndex,
    setCurrentIndex,
    isPlaying,
    setIsPlaying,
    audioRef,
  } = useContext(songcontext);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const currentSong = currentPlaylistSongs[currentIndex];

  // -----------------------------
  // LOAD CURRENT SONG
  // -----------------------------

  useEffect(() => {
    if (!currentSong || !audioRef.current) return;

    const audio = audioRef.current;

    audio.src = currentSong.audioUrl;
    audio.load();

    setCurrentTime(0);

    if (isPlaying) {
      audio.play().catch((error) => {
        console.log("Playback error:", error);
        setIsPlaying(false);
      });
    }
  }, [currentSong]);

  // -----------------------------
  // PLAY / PAUSE
  // -----------------------------

  const togglePlay = () => {
    if (!audioRef.current || !currentSong) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch((error) => {
        console.log("Playback error:", error);
      });

      setIsPlaying(true);
    }
  };

  // -----------------------------
  // NEXT SONG
  // -----------------------------

  const nextSong = () => {
    if (!currentPlaylistSongs.length) return;

    if (currentIndex < currentPlaylistSongs.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Go back to first song
      setCurrentIndex(0);
    }

    setIsPlaying(true);
  };

  // -----------------------------
  // PREVIOUS SONG
  // -----------------------------

  const previousSong = () => {
    if (!currentPlaylistSongs.length) return;

    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(currentPlaylistSongs.length - 1);
    }

    setIsPlaying(true);
  };

  // -----------------------------
  // TIME UPDATE
  // -----------------------------

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;

    setCurrentTime(audioRef.current.currentTime);
  };

  // -----------------------------
  // AUDIO LOADED
  // -----------------------------

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;

    setDuration(audioRef.current.duration);
  };

  // -----------------------------
  // SONG ENDED
  // -----------------------------

  const handleEnded = () => {
    nextSong();
  };

  // -----------------------------
  // PROGRESS BAR
  // -----------------------------

  const handleProgressChange = (e) => {
    const value = Number(e.target.value);

    if (!audioRef.current) return;

    audioRef.current.currentTime = value;
    setCurrentTime(value);
  };

  // -----------------------------
  // FORMAT TIME
  // -----------------------------

  const formatTime = (time) => {
    if (!time || isNaN(time)) {
      return "0:00";
    }

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Don't display footer until a song is selected
  if (!currentSong) {
    return null;
  }

  return (
    <footer className="player">

      {/* AUDIO */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      {/* SONG INFORMATION */}
      <div className="player-song">

        <img
          src={currentSong.image}
          alt={currentSong.title}
          className="player-song-image"
        />

        <div className="player-song-info">
          <h4>{currentSong.title}</h4>
          <p>{currentSong.artist}</p>
        </div>

      </div>

      {/* CENTER CONTROLS */}
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

        {/* PROGRESS */}
        <div className="player-progress">

          <span>{formatTime(currentTime)}</span>

          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleProgressChange}
          />

          <span>{formatTime(duration)}</span>

        </div>

      </div>

    </footer>
  );
};

export default Player;