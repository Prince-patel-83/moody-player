import { createContext, useRef, useState } from "react";

export const songcontext = createContext(null);

const Wrapper = ({ children }) => {
  // All songs
  const [Songs, setSongs] = useState([]);

  // User playlists
  const [playlists, setPlaylists] = useState([]);

  // Songs of the playlist currently being played
  const [currentPlaylistSongs, setCurrentPlaylistSongs] = useState([]);

  // Current song position
  const [currentIndex, setCurrentIndex] = useState(0);

  // Player state
  const [isPlaying, setIsPlaying] = useState(false);

  // Audio element
  const audioRef = useRef(null);

  // Logged-in user
  const [userData, setuserData] = useState();

  return (
    <songcontext.Provider
      value={{
        userData,
        setuserData,

        Songs,
        setSongs,

        playlists,
        setPlaylists,

        currentPlaylistSongs,
        setCurrentPlaylistSongs,

        currentIndex,
        setCurrentIndex,

        isPlaying,
        setIsPlaying,

        audioRef,
      }}
    >
      {children}
    </songcontext.Provider>
  );
};

export default Wrapper;