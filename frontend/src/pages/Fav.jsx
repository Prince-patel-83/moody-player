import { useContext } from "react";
import { songcontext } from "../Wrapper";

const moods = [
  { id: "happy", title: "Feel-good moments", subtitle: "A little sunshine for your day", icon: "ri-emotion-happy-line", tag: "BRIGHT" },
  { id: "sad", title: "For the quiet hours", subtitle: "Let the music sit with you", icon: "ri-emotion-unhappy-line", tag: "SOFT" },
  { id: "angry", title: "Let it out", subtitle: "Big feelings, bigger sound", icon: "ri-fire-line", tag: "INTENSE" },
  { id: "romantic", title: "Love, on repeat", subtitle: "A soundtrack for closeness", icon: "ri-heart-3-line", tag: "WARM" },
  { id: "calm", title: "Find your stillness", subtitle: "Slow down and breathe", icon: "ri-moon-clear-line", tag: "CALM" },
  { id: "energetic", title: "Full volume", subtitle: "For when you are ready to move", icon: "ri-flashlight-line", tag: "ENERGY" }
];


export default function Fav() {
  const { Songs = [], setCurrentSong, isPlaying, setIsPlaying } = useContext(songcontext) || {};
  const play = song => { const i = Songs.findIndex(s => s.id === song.id); if (i < 0) return; setCurrentSong?.(i); setIsPlaying?.(isPlaying === i ? null : i); };
  return (
     <main className="mood-collection-section page-shell">
    <header className="mood-collection-header page-heading">
      <div>
        <span className="section-kicker">MADE FOR YOUR MOMENTS</span>
        <h1>Music for every <em>mood.</em></h1>
        <p>Whatever the day feels like, there is a track for it.</p>
      </div>
      <div className="mood-header-stamp">
        <i className="ri-disc-3-line" />
        <span>MOODY<br />PLAYER</span>
      </div>
    </header>
    <div className="mood-collection-container">
      {moods.map((mood, mi) => {
        const list = (Array.isArray(Songs) ? Songs : []).filter(s => s.mood?.toLowerCase() === mood.id);
        return <section className="mood-collection-row" key={mood.id}>
          <div className="mood-row-heading"><div className="mood-row-title">
            <div className={`mood-row-icon mood-tone-${mi}`}>
              <i className={mood.icon} />
            </div>
            <div>
              <span className="mood-row-tag">{mood.tag} MOOD</span>
              <h2>{mood.title}</h2>
              <p>{mood.subtitle}</p>
            </div>
          </div>
            <span className="mood-track-count">{String(list.length).padStart(2, "0")} tracks</span>
          </div>

          {list.length ? <div className="mood-song-slider">
            {list.map(song => {
              const i = Songs.findIndex(s => s.id === song.id);
              return <article className="mood-collection-card" key={song.id}>
                <div className="mood-card-image-wrapper">
                  <img
                    src={song.image || song.coverImage || "/default-cover.png"}
                    alt="" className="mood-card-image"
                  />
                  <span className="mood-card-art-icon">
                    <i className={mood.icon} />
                  </span>
                  <button className="mood-card-play"
                    onClick={
                      () => play(song)} aria-label={`Play ${song.title}`
                      }>

                    <i className={isPlaying === i ? "ri-pause-fill" : "ri-play-fill"} />


                  </button>
                </div>
                <div className="mood-card-info">
                  <h3>{song.title}</h3>
                  <p>{song.artist || "Unknown artist"}</p>
                </div>
              </article>;
            })}</div> : <div className="mood-empty-row">
            <i className="ri-sound-module-line" />
            <span>No tracks in this mood yet. Add one through Upload.</span>
          </div>
          }
        </section>;
      })}
    </div>

  </main>
  )
 
}
