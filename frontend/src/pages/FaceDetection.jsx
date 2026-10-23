// import { useContext, useEffect, useRef, useState } from "react";
// import * as faceapi from "face-api.js";
// import axios from '../APi/axiosConfig.jsx'
// import "./faceExpression.css"
// import { songcontext } from "../Wrapper.jsx";

// const FaceDetection = () => {
//   const videoRef = useRef(null);
//   const [expression, setExpression] = useState("Loading...");
//   const {setSongs} = useContext(songcontext);
//   useEffect(() => {
//      loadModels();
//   }, []);

//   const loadModels = async () => {
//     try {
//       await Promise.all([
//         faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
//         faceapi.nets.faceExpressionNet.loadFromUri("/models"),
//       ]);

//       startVideo();
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const startVideo = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: true,
//       });

//       videoRef.current.srcObject = stream;

//       videoRef.current.onloadedmetadata = () => {
//         videoRef.current.play();
//       };
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const detectExpressions = async () => {

//     // setInterval( () => {
//       if (!videoRef.current) return;

//       const detection = await faceapi
//         .detectSingleFace(
//           videoRef.current,
//           new faceapi.TinyFaceDetectorOptions()
//         )
//         .withFaceExpressions();

//       if (!detection) {
//         setExpression("No Face");
//         return;
//       }

//       const bestExpression = Object.entries(detection.expressions).reduce(
//         (prev, current) => (prev[1] > current[1] ? prev : current)
//       );
//       console.log("expression "+bestExpression);

//       setExpression(bestExpression[0]);

//       const {data} = await axios.get(`/songs?mood=${bestExpression[0]}`);
//       console.log(data);

//       setSongs(data.songs);

//   };


//   return (
//     <>
//     <div className="Face-Expression">
//       <h2 >Live Face Expression</h2>
//       <video
//         ref={videoRef}
//         width="600"
//         height="450"
//         autoPlay
//         muted
//         playsInline
//         style={{
//           border: "2px solid black",
//           borderRadius: "10px",
//         }}
//       />
//       <button onClick={detectExpressions}>Detect FACE</button>
//       <h2 className="Expression" >{expression}</h2>
//     </div>
//     </>
//   );
// };

// export default FaceDetection;










import {
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import * as faceapi from "face-api.js";
import axios from "../APi/axiosConfig.jsx";
import { songcontext } from "../Wrapper.jsx";

import "./faceExpression.css";

const FaceDetection = () => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [expression, setExpression] = useState("Ready");
  const [isDetecting, setIsDetecting] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [cameraStarted, setCameraStarted] = useState(false);
  const [cameraError, setCameraError] = useState("");

  const {
    setSongs ,
    setCurrentPlaylistSongs ,
    setCurrentIndex ,
    setIsPlaying ,
  } = useContext(songcontext);

  // --------------------------------
  // LOAD FACE API MODELS
  // --------------------------------

  useEffect(() => {
    let cancelled = false;

    const loadModels = async () => {
      try {
        setExpression("Loading AI...");

        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
          faceapi.nets.faceExpressionNet.loadFromUri("/models"),
        ]);

        if (!cancelled) {
          setModelsLoaded(true);
          setExpression("Ready");

          console.log("Face API models loaded");
        }
      } catch (error) {
        console.error("MODEL LOAD ERROR:", error);

        if (!cancelled) {
          setExpression("Unable to load AI");
        }
      }
    };

    loadModels();

    return () => {
      cancelled = true;

      // Stop camera when component unmounts
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          track.stop();
        });

        streamRef.current = null;
      }
    };
  }, []);

  // --------------------------------
  // START CAMERA
  // --------------------------------

  const startCamera = async () => {
    try {
      setCameraError("");
      setExpression("Starting camera...");

      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraError(
          "Camera is unavailable. Please use HTTPS or localhost."
        );

        setExpression("Camera unavailable");

        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
        },
        audio: false,
      });

      streamRef.current = stream;

      if (!videoRef.current) {
        return;
      }

      videoRef.current.srcObject = stream;

      // IMPORTANT:
      // Wait until video metadata is available
      await new Promise((resolve) => {
        if (videoRef.current.readyState >= 1) {
          resolve();
        } else {
          videoRef.current.onloadedmetadata = resolve;
        }
      });

      await videoRef.current.play();

      console.log(
        "Video width:",
        videoRef.current.videoWidth
      );

      console.log(
        "Video height:",
        videoRef.current.videoHeight
      );

      setCameraStarted(true);
      setExpression("Ready");

    } catch (error) {
      console.error("CAMERA ERROR:", error);

      setCameraError(
        "Camera access was not granted. Check your browser permissions."
      );

      setExpression("Camera unavailable");
    }
  };

  // --------------------------------
  // STOP CAMERA
  // --------------------------------

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });

      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }

    setCameraStarted(false);
    setIsDetecting(false);
    setExpression("Ready");
  };

  // --------------------------------
  // DETECT FACE + EXPRESSION
  // --------------------------------

 const detectExpressions = async () => {
  if (!videoRef.current) {
    console.log("Video not available");
    return;
  }

  try {
    setIsDetecting(true);
    setExpression("Analyzing...");

    const detection = await faceapi
      .detectSingleFace(
        videoRef.current,
        new faceapi.TinyFaceDetectorOptions()
      )
      .withFaceExpressions();

    console.log("DETECTION:", detection);

    if (!detection) {
      console.log("❌ No face detected");
      setExpression("No Face");
      return;
    }

    console.log("✅ Face detected");
    console.log(
      "Expressions:",
      detection.expressions
    );

    const bestExpression = Object.entries(
      detection.expressions
    ).reduce((prev, current) =>
      prev[1] > current[1] ? prev : current
    );

    const detectedExpression = bestExpression[0];

    console.log(
      "Detected expression:",
      detectedExpression
    );

    setExpression(detectedExpression);

    const moodMap = {
      happy: "happy",
      sad: "sad",
      angry: "angry",
      surprised: "energetic",
      fearful: "relaxed",
      disgusted: "angry",
      neutral: "relaxed",
    };

    const detectedMood =
      moodMap[detectedExpression] || "relaxed";

    console.log(
      "Music mood:",
      detectedMood
    );

    const { data } = await axios.get(
      `/songs?mood=${encodeURIComponent(
        detectedMood
      )}`
    );

    console.log("Songs:", data);

    const moodSongs = data?.songs || [];

    setSongs(moodSongs);
    setCurrentPlaylistSongs(moodSongs);
    setCurrentIndex(0);
    setIsPlaying(false);

  } catch (error) {
    console.error(
      "DETECTION ERROR:",
      error
    );

    setExpression("Detection failed");

  } finally {
    setIsDetecting(false);
  }
};
  // --------------------------------
  // MOOD ICON
  // --------------------------------

  const getMoodIcon = () => {
    const icons = {
      happy: "ri-emotion-happy-line",
      sad: "ri-emotion-unhappy-line",
      angry: "ri-emotion-normal-line",

      neutral: "ri-emotion-line",
      fearful: "ri-emotion-normal-line",
      disgusted: "ri-emotion-unhappy-line",
      surprised: "ri-emotion-happy-line",

      Ready: "ri-sparkling-2-line",
      "Loading AI...": "ri-loader-4-line",
      "Starting camera...": "ri-loader-4-line",
      "Analyzing...": "ri-loader-4-line",
      "No Face": "ri-user-unfollow-line",
      "Unable to load AI":
        "ri-error-warning-line",
      "Camera unavailable":
        "ri-camera-off-line",
      "Detection failed":
        "ri-error-warning-line",
    };

    return (
      icons[expression] ||
      "ri-emotion-line"
    );
  };


  // 


  const testFaceDetection = async () => {
    const video = videoRef.current;

    if (!video) {
      console.log("Video missing");
      return;
    }

    console.log("Video:", video);
    console.log("Width:", video.videoWidth);
    console.log("Height:", video.videoHeight);

    const options = new faceapi.TinyFaceDetectorOptions({
      inputSize: 416,
      scoreThreshold: 0.1,
    });

    const detections = await faceapi.detectAllFaces(
      video,
      options
    );

    console.log("ALL FACES:", detections);
  };
  // --------------------------------
  // DESCRIPTION
  // --------------------------------

  const description = () => {
    if (!modelsLoaded) {
      return "Preparing the AI models. This may take a moment.";
    }

    if (
      expression === "Ready" &&
      !cameraStarted
    ) {
      return "Start your camera when you're ready. Your camera is used for on-device facial expression analysis.";
    }

    if (expression === "Ready") {
      return "Position your face inside the camera and detect your current expression.";
    }

    if (expression === "No Face") {
      return "No face was detected. Adjust your position and try again.";
    }

    if (expression === "Analyzing...") {
      return "Analyzing your facial expression and finding matching songs.";
    }

    if (expression === "Loading AI...") {
      return "Loading the AI models...";
    }

    if (expression === "Unable to load AI") {
      return "AI models could not be loaded. Check that your models are in the public/models folder.";
    }

    if (expression === "Camera unavailable") {
      return cameraError;
    }

    if (expression === "Detection failed") {
      return "Something went wrong while detecting your expression. Please try again.";
    }

    return "Expression detected. Your music recommendations have been updated.";
  };

  // --------------------------------
  // UI
  // --------------------------------

  return (
    <section className="mood-detection-section">

      {/* HEADER */}

      <div className="mood-detection-header">

        <div>

          <span className="mood-detection-eyebrow">
            <i className="ri-sparkling-2-fill"></i>
            AI MUSIC EXPERIENCE
          </span>

          <h1>
            Music that matches
            <span> your mood.</span>
          </h1>

          <p>
            Discover music inspired by your facial
            expression and enjoy a personalized
            listening experience.
          </p>

        </div>

        <div className="ai-status">

          <span
            className={`ai-status-dot ${modelsLoaded
              ? "ai-ready"
              : "ai-loading"
              }`}
          />

          {modelsLoaded
            ? "AI Models Ready"
            : "Loading AI"}

        </div>

      </div>

      {/* MAIN CARD */}

      <div className="mood-detection-card">

        {/* CAMERA */}

        <div className="camera-preview-wrapper">

          <video
            ref={videoRef}
            className="mood-camera-preview"
            autoPlay
            muted
            playsInline
          />

          {!cameraStarted && (
            <div className="camera-placeholder">

              <div className="camera-placeholder-icon">
                <i className="ri-camera-lens-line"></i>
              </div>

              <h3>
                Your mood, your music
              </h3>

              <p>
                Start the camera when you're
                ready to discover your music.
              </p>

            </div>
          )}

          <div className="camera-overlay">

            <div className="camera-corner top-left"></div>

            <div className="camera-corner top-right"></div>

            <div className="camera-corner bottom-left"></div>

            <div className="camera-corner bottom-right"></div>

          </div>

          {cameraStarted && (
            <div className="camera-label">
              <span></span>
              CAMERA ON
            </div>
          )}

        </div>

        {/* ANALYSIS PANEL */}

        <div className="mood-analysis-panel">

          <div className="mood-analysis-top">

            <span className="mood-analysis-label">
              YOUR EXPRESSION
            </span>

            <div className="mood-analysis-icon">
              <i className={getMoodIcon()}></i>
            </div>

          </div>

          <h2 className="detected-mood">
            {expression}
          </h2>

          <p className="mood-analysis-description">
            {description()}
          </p>

          {cameraError && (
            <div className="camera-error">

              <i className="ri-error-warning-line"></i>

              {cameraError}

            </div>
          )}

          {/* CAMERA BUTTON */}

          {!cameraStarted ? (
            <>



              <button
                className="detect-mood-button"
                onClick={startCamera}
                disabled={!modelsLoaded}
              >


                <i className="ri-camera-line"></i>

                {modelsLoaded
                  ? "Start Camera"
                  : "Loading AI..."}

              </button>

            </>

          ) : (

            <div className="camera-actions">

              <button
                className="detect-mood-button"
                onClick={detectExpressions}
                disabled={
                  isDetecting ||
                  !modelsLoaded
                }
              >

                <i
                  className={
                    isDetecting
                      ? "ri-loader-4-line"
                      : "ri-sparkling-2-line"
                  }
                ></i>

                {isDetecting
                  ? "Analyzing..."
                  : "Detect My Mood"}

              </button>

              <button
                className="stop-camera-button"
                onClick={stopCamera}
                disabled={isDetecting}
                title="Turn off camera"
              >

                <i className="ri-camera-off-line"></i>

              </button>

            </div>

          )}

          {/* PRIVACY */}

          <div className="camera-privacy-note">

            <i className="ri-shield-check-line"></i>

            Camera access is controlled by you.

          </div>

        </div>

      </div>

    </section>
  );
};

export default FaceDetection;