const Playlist = require("../models/playlist.model");
const Song = require("../models/song.model");

const createPlaylist = async (req, res) => {
  try {
    const { name, mood } = req.body;

    if (!name || !mood) {
      return res.status(400).json({
        success: false,
        message: "Playlist name and mood are required",
      });
    }

    const playlist = await Playlist.create({
      name,
      mood,
      user: req.userId,
      songs: [],
    });

    return res.status(201).json({
      success: true,
      message: "Playlist created successfully",
      playlist,
    });
  } catch (error) {
    console.error("Create playlist error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getUserPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find({
      user: req.userId,
    })
      .populate("songs")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: playlists.length,
      playlists,
    });
  } catch (error) {
    console.error("Get playlists error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


const getPlaylistById = async (req, res) => {
  try {
    const { playlistId } = req.params;

    const playlist = await Playlist.findOne({
      _id: playlistId,
      user: req.userId,
    }).populate("songs");

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: "Playlist not found",
      });
    }

    return res.status(200).json({
      success: true,
      playlist,
    });
  } catch (error) {
    console.error("Get playlist error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const updatePlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const { name, mood } = req.body;

    const playlist = await Playlist.findOne({
      _id: playlistId,
      user: req.userId,
    });

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: "Playlist not found",
      });
    }

    if (name) {
      playlist.name = name;
    }

    if (mood) {
      playlist.mood = mood;
    }

    await playlist.save();

    return res.status(200).json({
      success: true,
      message: "Playlist updated successfully",
      playlist,
    });
  } catch (error) {
    console.error("Update playlist error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const deletePlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;

    const playlist = await Playlist.findOneAndDelete({
      _id: playlistId,
      user: req.userId,
    });

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: "Playlist not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Playlist deleted successfully",
    });
  } catch (error) {
    console.error("Delete playlist error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const addSongToPlaylist = async (req, res) => {
  try {
    const { playlistId , songId } = req.params;

    // Find playlist owned by logged-in user
    const playlist = await Playlist.findOne({
      _id: playlistId,
      user: req.userId,
    });

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: "Playlist not found",
      });
    }

    // Check song exists
    const song = await Song.findById(songId);

    if (!song) {
      return res.status(404).json({
        success: false,
        message: "Song not found",
      });
    }

    // Check mood
    if (song.mood !== playlist.mood) {
      return res.status(400).json({
        success: false,
        message: `This song does not match the ${playlist.mood} mood`,
      });
    }

    // Add song without duplicate
    await Playlist.findByIdAndUpdate(
      playlistId,
      {
        $addToSet: {
          songs: songId,
        },
      },
      {
        new: true,
      }
    );

    const updatedPlaylist = await Playlist.findById(
      playlistId
    ).populate("songs");

    return res.status(200).json({
      success: true,
      message: "Song added to playlist",
      playlist: updatedPlaylist,
    });
  } catch (error) {
    console.error("Add song error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const removeSongFromPlaylist = async (req, res) => {
  try {
    const { playlistId, songId } = req.params;

    const playlist = await Playlist.findOne({
      _id: playlistId,
      user: req.userId,
    });

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: "Playlist not found",
      });
    }

    await Playlist.findByIdAndUpdate(
      playlistId,
      {
        $pull: {
          songs: songId,
        },
      },
      {
        new: true,
      }
    );

    const updatedPlaylist = await Playlist.findById(
      playlistId
    ).populate("songs");

    return res.status(200).json({
      success: true,
      message: "Song removed from playlist",
      playlist: updatedPlaylist,
    });
  } catch (error) {
    console.error("Remove song error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  updatePlaylist,
  deletePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
};