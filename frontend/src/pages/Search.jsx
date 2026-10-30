
import { useContext, useEffect, useMemo, useState } from "react";
import { songcontext } from "../Wrapper";
import axios from "../APi/axiosConfig";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");

  const {
    Songs = [],
    setSongs,
    currentPlaylistSongs = [],
    setCurrentPlaylistSongs,
    currentIndex,
    setCurrentIndex,
    isPlaying,
    setIsPlaying
  } = useContext(songcontext) || {};

  // 1. Filter songs from existing library
  const filteredSongs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    if (!q) return [];

    return Songs.filter(song =>
      song.title?.toLowerCase().includes(q)
    );
  }, [Songs, searchQuery]);

  // 2. Search API after user stops typing
  useEffect(() => {
    const query = searchQuery.trim();

    if (!query) return;

    const timer = setTimeout(async () => {
      // Check whether song already exists in library
      const alreadyExists = Songs.some(song =>
        song.title?.toLowerCase().startsWith(query.toLowerCase())
      );

      if (alreadyExists) return;

      try {
        const response = await axios.get(
          `/songs/search?query=${encodeURIComponent(query)}`
        );

        const newSongs = response.data.songs || [];

        // Add only unique songs
        if (newSongs.length > 0) {
          setSongs?.(prevSongs => {
            const existingIds = new Set(
              prevSongs.map(song => song._id)
            );

            const uniqueSongs = newSongs.filter(
              song => !existingIds.has(song._id)
            );

            return [...prevSongs, ...uniqueSongs];
          });
        }

      } catch (error) {
        console.log("Search error:", error);
      }
    }, 1900);

    return () => clearTimeout(timer);

  }, [searchQuery, Songs, setSongs]);

  const play = (song) => {
  const songIndex = filteredSongs.findIndex(
    s => s._id === song._id
  );

  if (songIndex === -1) return;

  const currentlyPlayingSong =
    currentPlaylistSongs[currentIndex];

  // Same song clicked: pause
  if (
    currentlyPlayingSong?._id === song._id &&
    isPlaying
  ) {
    setIsPlaying(false);
    return;
  }

  // Update queue
  setCurrentPlaylistSongs(filteredSongs);

  // Update selected song
  setCurrentIndex(songIndex);

  // Start playing
  setIsPlaying(true);
};

  return (
    <main className="music-search-page page-shell">

      <section className="search-hero">
        <span className="section-kicker">
          FIND YOUR FREQUENCY
        </span>

        <h1>
          What sounds like <em>you?</em>
        </h1>

        <p>Search your library by song name.</p>

        <label
          className="music-search-input-wrapper"
          htmlFor="music-search-input"
        >
          <i className="ri-search-line music-search-icon" />

          <input
            id="music-search-input"
            type="search"
            className="music-search-input"
            placeholder="Try a song..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </label>
      </section>

      <section className="music-search-results">

        {!searchQuery.trim() ? (

          <div className="search-empty-state">
            <div className="search-empty-icon">
              <i className="ri-headphone-line" />
            </div>

            <h2>Your next song is out there.</h2>

            <p>
              Start typing to search the songs in your library.
            </p>
          </div>

        ) : (

          <>
            <div className="search-results-heading">
              <div>
                <span className="section-kicker">
                  YOUR LIBRARY
                </span>

                <h2>Search results</h2>
              </div>

              <span className="search-result-count">
                {filteredSongs.length}{" "}
                {filteredSongs.length === 1 ? "track" : "tracks"}
              </span>
            </div>

            {filteredSongs.length > 0 ? (

              <div className="search-results-list">

                {filteredSongs.map(song => {

                  const isCurrentSong =
                    currentPlaylistSongs?.[currentIndex]?._id ===
                    song._id;

                  const isCurrentSongPlaying =
                    isCurrentSong && isPlaying;

                  return (
                    <article
                      key={song._id}
                      className="music-search-song-card"
                    >

                      <div className="search-song-art">
                        <span>
                          <i className="ri-music-2-line" />
                        </span>
                      </div>

                      <div className="music-search-song-info">
                        <h3 className="music-search-song-title">
                          {song.title}
                        </h3>

                        <p className="music-search-song-artist">
                          {song.artist || "Unknown artist"}
                        </p>
                      </div>

                      {song.mood && (
                        <span className="search-song-mood">
                          {song.mood}
                        </span>
                      )}

                      <button
                        className="music-search-song-play"
                        onClick={() => play(song)}
                        aria-label={
                          `${isCurrentSongPlaying ? "Pause" : "Play"} ${song.title}`
                        }
                      >
                        <i
                          className={
                            isCurrentSongPlaying
                              ? "ri-pause-fill"
                              : "ri-play-fill"
                          }
                        />
                      </button>

                    </article>
                  );
                })}

              </div>

            ) : (

              <div className="search-no-results">
                <i className="ri-search-eye-line" />

                <h3>No matches just yet</h3>

                <p>
                  Try another song or mood.
                </p>
              </div>

            )}
          </>

        )}

      </section>
    </main>
  );
}
