import { useState } from "react";
import { useContext } from "react";
import { songcontext } from "../Wrapper";
import axios from "../APi/axiosConfig";
import { toast } from "react-toastify";
import "../App.css"
const Upload = () => {
  const { Songs, setSongs } = useContext(songcontext);
  const [isLoading, setisLoading] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    audio: "",
    mood: "",
  });

  const handleChange = (e) => {

    const { name, value, files } = e.target;
    
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });

    // setFormData({
    //   ...formData,
    //   [e.target.name]: e.target.value,
    // });
  };

  // console.log(formData);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(isLoading) return;

    setisLoading(true) ;
    try {

       const data = new FormData();

       data.append("title", formData.title);
       data.append("artist", formData.artist);
       data.append("mood", formData.mood);
       data.append("audio", formData.audio);

      // Connect your API here
     
      const res = await axios.post(`/api/song/upload`, data);
      console.log(res);
      setisLoading(false);
      toast.success("song created sucessfully");
    
      // setFormData({
      //   title: "",
      //   artist: "",
      //   audio: "",
      //   mood: "",
      // });

    } catch (error) {
      console.error("Upload error:", error);
      setisLoading(false);
      toast.error(
        error.response?.data?.message || "Upload failed"
      );
    }
  };

  return (
    <div className="upload-song-page">

      <div className="upload-song-wrapper">

        {/* Header */}
        <div className="upload-song-header">

          

          <div className="upload-song-heading">
            <span className="upload-song-eyebrow">
              MUSIC LIBRARY
            </span>

            <h1>Upload a Song</h1>

            <p>
              Add a new song to your music collection and assign
              a mood to it.
            </p>
          </div>

        </div>


        {/* Main Content */}
        <div className="upload-song-content">

          {/* Form Card */}
          <div className="upload-song-card">

            <div className="upload-song-card-header">
              <div className="upload-song-card-icon">
                <i className="ri-upload-cloud-2-line"></i>
              </div>

              <div>
                <h2>Song Details</h2>
                <p>Enter information about your song</p>
              </div>
            </div>


            <form
              className="upload-song-form"
              onSubmit={handleSubmit}
            >

              {/* Title */}
              <div className="upload-song-field">

                <label>
                  Song Title
                </label>

                <div className="upload-song-input">
                  <i className="ri-music-line"></i>

                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter song title"
                    required
                  />
                </div>

              </div>


              {/* Artist */}
              <div className="upload-song-field">

                <label>
                  Artist
                </label>

                <div className="upload-song-input">
                  <i className="ri-user-music-line"></i>

                  <input
                    type="text"
                    name="artist"
                    value={formData.artist}
                    onChange={handleChange}
                    placeholder="Enter artist name"
                    required
                  />
                </div>

              </div>


              {/* Audio file */}
              <div className="upload-song-field">

                <label>
                  Audio File
                </label>

                <div className="upload-song-input">
                  <i className="ri-link"></i>

                  <input
                    type="file"
                    name="audio"
                    // value={formData.audio?.File[0] }
                    onChange={handleChange}
                    placeholder="Upload audio file"
                    required
                  />
                </div>

                <span className="upload-song-hint">
                  uploaded audio file.
                </span>

              </div>


              {/* Mood */}
              <div className="upload-song-field">

                <label>
                  Song Mood
                </label>

                <div className="upload-song-mood-grid">

                  <button
                    type="button"
                    className={`upload-mood-option ${formData.mood === "happy"
                      ? "upload-mood-active"
                      : ""
                      }`}
                    onClick={() =>
                      setFormData({
                        ...formData,
                        mood: "happy",
                      })
                    }
                  >
                    <i className="ri-emotion-happy-line"></i>
                    <span>Happy</span>
                  </button>


                  <button
                    type="button"
                    className={`upload-mood-option ${formData.mood === "sad"
                      ? "upload-mood-active"
                      : ""
                      }`}
                    onClick={() =>
                      setFormData({
                        ...formData,
                        mood: "sad",
                      })
                    }
                  >
                    <i className="ri-emotion-unhappy-line"></i>
                    <span>Sad</span>
                  </button>


                  <button
                    type="button"
                    className={`upload-mood-option ${formData.mood === "angry"
                      ? "upload-mood-active"
                      : ""
                      }`}
                    onClick={() =>
                      setFormData({
                        ...formData,
                        mood: "angry",
                      })
                    }
                  >
                    <i className="ri-fire-line"></i>
                    <span>Angry</span>
                  </button>


                  <button
                    type="button"
                    className={`upload-mood-option ${formData.mood === "romantic"
                      ? "upload-mood-active"
                      : ""
                      }`}
                    onClick={() =>
                      setFormData({
                        ...formData,
                        mood: "romantic",
                      })
                    }
                  >
                    <i className="ri-heart-3-line"></i>
                    <span>Romantic</span>
                  </button>


                  <button
                    type="button"
                    className={`upload-mood-option ${formData.mood === "calm"
                      ? "upload-mood-active"
                      : ""
                      }`}
                    onClick={() =>
                      setFormData({
                        ...formData,
                        mood: "calm",
                      })
                    }
                  >
                    <i className="ri-moon-clear-line"></i>
                    <span>Calm</span>
                  </button>


                  <button
                    type="button"
                    className={`upload-mood-option ${formData.mood === "energetic"
                      ? "upload-mood-active"
                      : ""
                      }`}
                    onClick={() =>
                      setFormData({
                        ...formData,
                        mood: "energetic",
                      })
                    }
                  >
                    <i className="ri-flashlight-line"></i>
                    <span>Energetic</span>
                  </button>

                </div>

                {!formData.mood && (
                  <span className="upload-song-hint">
                    Select the mood that best matches this song.
                  </span>
                )}

              </div>


              {/* Submit */}
              <button
                type="submit"
                className="upload-song-submit"
                disabled={isLoading}
              >
                <i className="ri-upload-2-line"></i>

                <span>{isLoading ? "Loading..." :"Upload Song"}</span>
              </button>

            </form>

          </div>


          {/* Preview Card */}
          <div className="upload-song-preview">

            <div className="upload-preview-image">
              <i className="ri-music-2-fill"></i>
            </div>

            <span className="upload-preview-label">
              SONG PREVIEW
            </span>

            <h3>
              {formData.title || "Your Song"}
            </h3>

            <p>
              {formData.artist || "Artist Name"}
            </p>

            <div className="upload-preview-mood">

              <i className="ri-emotion-line"></i>

              <span>
                {formData.mood
                  ? formData.mood
                  : "Select a mood"}
              </span>

            </div>

            {formData.audio && (
              <div className="upload-preview-audio">

                <i className="ri-volume-up-line"></i>

                <span>
                  Audio URL added
                </span>

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};

export default Upload;