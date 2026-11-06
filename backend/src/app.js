const express = require("express");
const AuthRoutes = require('./routes/auth.routes');
const playlistRoutes = require("./routes/playList.route");
const SongRoutes = require("./routes/song.routes")
const cookieParser = require("cookie-parser")
const cors = require('cors')
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
const app = express();


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(cors(
    {
        origin: frontendUrl,
        credentials: true,
    }
    )
);

app.use('/api/auth', AuthRoutes);
app.use("/api/songs" , SongRoutes);
app.use("/api/playlists", playlistRoutes);


module.exports = app;