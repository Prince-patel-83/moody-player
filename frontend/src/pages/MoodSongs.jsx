// import { useContext,useEffect,useRef,useState } from 'react'
// import { songcontext } from '../Wrapper'
// // import SongPlayer from '../components/SongPlayer'
// import "./MoodSongs.css"
// import './faceExpression.css'

// const MoodSongs = () => {

// const { Songs }= useContext(songcontext); 
// const {currentSong, setCurrentSong} = useContext(songcontext);
// const {isPlaying, setIsPlaying} = useContext(songcontext);
// const audioRef = useRef(null);



//   useEffect(()=>{
//   }, [currentSong])

  
// const HandlePlay =(idx)=>{
//     setCurrentSong(idx);

//     if(isPlaying === idx){
//         setIsPlaying(null);
//     }else{
//         setIsPlaying(idx);
//     }
// }

//   return (
//     <>
//     <div className='Songs'>
//         <h1>Recomanded Songs</h1>

//         {Songs.map((song , idx)=>{
//         return <div className='song' key={idx}>
//                 <div className='title'>
//                     <h3>{song.title}</h3>
//                     <h4>{song.artist}</h4>
                    
//                 </div>
//                 <div onClick={()=>HandlePlay(idx)} className='play-pause-button'>
//                     {isPlaying === idx && 
//                         <audio src={Songs[currentSong].audio}
//                             ref={audioRef}
//                             autoPlay = {isPlaying === idx}
//                         ></audio>
//                     }
                    
//                     {isPlaying === idx ? (
//                         <i className="ri-pause-fill"></i>
//                     ) : (
//                         <i className="ri-play-large-fill"></i>
//                     )}
//                 </div>
//             </div>
//         })}
         
//     </div>
    
//     {/* < SongPlayer audioRef={audioRef} songs={Songs} /> */}
    
// </>
//   )
// }

// export default MoodSongs











import { useContext, useEffect } from "react";
import { songcontext } from "../Wrapper.jsx";
import "./MoodSongs.css";

const MoodSongs = () => {
  const {
    Songs,
    currentPlaylistSongs,
    setCurrentPlaylistSongs,
    currentIndex,
    setCurrentIndex,
    isPlaying,
    setIsPlaying,
    audioRef,
  } = useContext(songcontext);

  // Songs load hone ke baad current playlist set karo
  useEffect(() => {
    if (Songs?.length > 0) {
      setCurrentPlaylistSongs(Songs);
    }
  }, [Songs, setCurrentPlaylistSongs]);

  // Play / Pause
  const HandlePlay = (idx) => {
    // Agar same song chal raha hai -> pause
    if (currentIndex === idx && isPlaying) {
      setIsPlaying(false);

      if (audioRef.current) {
        audioRef.current.pause();
      }

      return;
    }

    // Recommended songs ko current playlist banao
    setCurrentPlaylistSongs(Songs);

    // Current song set karo
    setCurrentIndex(idx);

    // Play state
    setIsPlaying(true);
  };

  // Jab currentIndex ya isPlaying change ho
  // tab actual audio control karo
  useEffect(() => {
    if (!audioRef.current || !currentPlaylistSongs?.length) {
      return;
    }

    const currentSong = currentPlaylistSongs[currentIndex];

    if (!currentSong?.audio) {
      return;
    }

    audioRef.current.src = currentSong.audio;

    if (isPlaying) {
      audioRef.current
        .play()
        .catch((error) => {
          console.log("Audio play error:", error);
        });
    } else {
      audioRef.current.pause();
    }
  }, [
    currentIndex,
    isPlaying,
    currentPlaylistSongs,
    audioRef,
  ]);

  return (
    <section className="mood-song-section">

      {/* Hidden audio player */}
      <audio ref={audioRef} />

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

        {Songs?.length > 0 ? (
          Songs.map((song, idx) => {

            const isCurrentSong =
              currentIndex === idx && isPlaying;

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
                    onClick={() => HandlePlay(idx)}
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