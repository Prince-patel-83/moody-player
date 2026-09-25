const express = require('express');
const router = express.Router();
const multer = require('multer');
const protect = require("../middleware/auth.middleware.js")
const {  GetSongController, UploadSongController } = require('../controllers/song.controller.js');


const upload = multer({ storage: multer.memoryStorage()})

router.post('/upload' , upload.single("audio"), protect ,UploadSongController )

router.get("/" , GetSongController);

module.exports = router;