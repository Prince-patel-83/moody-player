const express = require("express");
const AuthRoutes = require('./routes/auth.routes');
const playlistRoutes = require("./routes/playList.route");
const SongRoutes = require("./routes/song.routes")
const cookieParser = require("cookie-parser")
const cors = require('cors')
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(cors(
    {
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use('/api/auth', AuthRoutes);
app.use("/api/song" , SongRoutes);
app.use("/api/playlists", playlistRoutes);


module.exports = app;