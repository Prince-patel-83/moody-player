const express = require("express");

const router = express.Router();

const {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  updatePlaylist,
  deletePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
} = require("../controllers/playList.controller");

const protect = require("../middleware/auth.middleware");

// Create playlist
router.use(protect);

router.post("/", createPlaylist);

// Get all playlists
router.get("/", getUserPlaylists);

// Get one playlist
router.get("/:playlistId", getPlaylistById);

// Update playlist
router.put("/:playlistId", updatePlaylist);

// Delete playlist
router.delete("/:playlistId", deletePlaylist);

// Add song
router.post(
  "/:playlistId/songs/:songId",
  addSongToPlaylist
);

// Remove song
router.delete(
  "/:playlistId/songs/:songId",
  removeSongFromPlaylist
);

module.exports = router;