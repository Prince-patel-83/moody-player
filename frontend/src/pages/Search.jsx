import { useContext, useMemo, useState } from "react";
import { songcontext } from "../Wrapper";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");

  const {
    Songs = [], setCurrentSong,
    isPlaying, setIsPlaying
  } = useContext(songcontext) || {};

  const filteredSongs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return
    q ? (Array.isArray(Songs) ? Songs : []).filter(s => `${s.title || ""} ${s.artist || ""} ${s.mood || ""}`.toLowerCase().includes(q)) : [];
  }, [Songs, searchQuery]);


// const Search = () => {
//   const [search, setSearch] = useState("");

//   useEffect(() => {
//     // Empty search par API call mat karo
//     if (!search.trim()) {
//       return;
//     }

//     // 4 second ka timer
//     const timer = setTimeout(() => {
//       sendSearchRequest();
//     }, 4000);

//     // User dobara type kare to previous timer cancel
//     return () => {
//       clearTimeout(timer);
//     };

//   }, [search]);

//   const sendSearchRequest = async () => {
//     try {
//       const response = await axios.get(
//         `/api/songs/search?query=${encodeURIComponent(search)}`
//       );

//       console.log(response.data);
//     } catch (error) {
//       console.log("Search error:", error);
//     }
//   };

//   return (
//     <input
//       type="text"
//       value={search}
//       onChange={(e) => setSearch(e.target.value)}
//       placeholder="Search songs..."
//     />
//   );
// };




  const play = song => {
    const i = Songs.findIndex(s => s.id === song.id);
    if (i < 0)
      return; setCurrentSong?.(i);
    setIsPlaying?.(isPlaying === i ? null : i);
  };

  return(
    <>
    <main className="music-search-page page-shell">
      <section className="search-hero">
        <span className="section-kicker">FIND YOUR FREQUENCY</span>
        <h1>
          What sounds like <em>you?</em>
        </h1>
        <p>Search your library by song, artist, or mood.</p>
        <label className="music-search-input-wrapper" htmlFor="music-search-input">
          <i className="ri-search-line music-search-icon" />
          <input id="music-search-input"
            type="search"
            className="music-search-input"
            placeholder="Try a song, artist, or mood..."
            value={searchQuery}
            onChange={
              e => setSearchQuery(e.target.value)
            } />

          {searchQuery && <button type="button" className="search-clear"
            onClick={
              () => setSearchQuery("")
            } aria-label="Clear search">
            <i className="ri-close-line" />
          </button>
          }
        </label>
      </section>
      <section
        className="music-search-results">
        {!searchQuery.trim() ?
          <div className="search-empty-state">
            <div className="search-empty-icon">
              <i className="ri-headphone-line" />
            </div>
            <h2>
              Your next song is out there.</h2>
            <p>Start typing to search the songs in your library.</p>
          </div>
          : <>
            <div className="search-results-heading">
              <div>
                <span className="section-kicker">YOUR LIBRARY</span>
                <h2>Search results</h2>
              </div>
              <span className="search-result-count">

                {filteredSongs?.length}
                {filteredSongs?.length === 1 ? "track" : "tracks"}
              </span>
            </div>
            {filteredSongs.length ?
              <div className="search-results-list">
                {filteredSongs.map(song => {
                  const i = Songs.findIndex(s => s.id === song.id);
                  return <article className="music-search-song-card"
                    key={song.id}>
                    <div className="search-song-art">
                      <img src={song.image || song.coverImage || "/default-cover.png"}
                        alt=""
                      />
                      <span>

                        <i className="ri-music-2-line" />
                      </span>
                    </div>
                    <div className="music-search-song-info">
                      <h3 className="music-search-song-title">{song.title}</h3>
                      <p className="music-search-song-artist">{song.artist || "Unknown artist"}</p>
                    </div>
                    {
                      song.mood && <span className="search-song-mood">{song.mood}</span>
                    }
                    <button className="music-search-song-play"
                      onClick={() => play(song)}
                      aria-label={`Play ${song.title}`
                      }>
                      <i className={isPlaying === i ? "ri-pause-fill" : "ri-play-fill"} />
                    </button>
                  </article>
                })}
              </div> : <div className="search-no-results">
                <i className="ri-search-eye-line" />
                <h3>No matches just yet</h3>
                <p>Try another title, artist, or mood.</p>
              </div>
            }
          </>
        }
      </section>
    </main>

  </>
  )
}
