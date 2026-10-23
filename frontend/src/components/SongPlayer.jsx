import { useContext, useEffect, useRef, useState } from "react";
import "./MoodSongs.css";
import { songcontext } from "../Wrapper";

const SongPlayer = ({ songs ,audioRef}) => {

  const progressRef = useRef(null);
  const {currentSong, setCurrentSong} = useContext(songcontext);
  const [progress, setProgress] = useState(0);
  const {isPlaying, setIsPlaying} = useContext(songcontext);

  // Play / Pause
  const handlePlayPause = () => {

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(null);
    } else {
      audioRef.current.play();
      setIsPlaying(currentSong);
    }
  };

  // Next Song
  const nextSong = () => {
    setCurrentSong((prev) => (prev + 1) % songs.length);
    setProgress(0);
    setIsPlaying(currentSong);
  };

  // Previous Song
  const previousSong = () => {
    setCurrentSong((prev) =>
      prev === 0 ? songs.length - 1 : prev - 1
    );
    setProgress(0);
    setIsPlaying(currentSong);
  };

  // Change song
  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.load();

    if (isPlaying) {
      audioRef.current.play();
    }
  }, [currentSong]);

  // Progress Update
  useEffect(() => {
    const audio = audioRef.current;

    const updateProgress = () => {
      if (!audio.duration) return;

      const percent =
        (audio.currentTime / audio.duration) * 100;

      setProgress(percent);
    };

    audio?.addEventListener("timeupdate", updateProgress);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
    };
  }, []);

  // Click Progress Bar
  const changeProgress = (e) => {
    const width = progressRef.current.clientWidth;

    const clickX =
      e.nativeEvent.offsetX;

    const percent = clickX / width;

    audioRef.current.currentTime =
      percent * audioRef.current.duration;

    setProgress(percent * 100);
  };

  return (
    <div className="Player">

      {/* Progress */}

      <div
        className="song-control"
        ref={progressRef}
        onClick={changeProgress}
      >

        <div
          className="Song-played"
          style={{ width: `${progress}%` }}
        ></div>

        <div
          className="song-control-Pointer"
          style={{ left: `${progress}%` }}
        ></div>

      </div>

      {/* Controls */}

      <div className="play-pause-control">

        <div
          className="pre-Song"
          onClick={previousSong}
        >
          <i className="ri-skip-back-fill"></i>
        </div>

        <div
          className="play-pause-button"
          onClick={handlePlayPause}
        >
          {isPlaying ? (
            <i className="ri-pause-fill"></i>
          ) : (
            <i className="ri-play-large-fill"></i>
          )}
        </div>

        <div
          className="Next-Song"
          onClick={nextSong}
        >
          <i className="ri-skip-forward-fill"></i>
        </div>

      </div>

      <audio
       
        src={songs[currentSong]?.url}
        onEnded={nextSong}
      />

    </div>
  );
};

export default SongPlayer;