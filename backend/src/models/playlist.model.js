const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      // required: true,
      trim: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    mood: {
      type: String,
      enum: [
        "happy",
        "sad",
        "romantic",
        "relaxed",
        "energetic",
        "angry",
      ],
      required: true,
    },

    songs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Song",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const PlayListModel  =mongoose.model("Playlist", playlistSchema);

module.exports = PlayListModel;