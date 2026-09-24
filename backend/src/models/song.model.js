const mongoose = require('mongoose');


const songSchema = new mongoose.Schema({
    title:String,
    artist:String,
    audio:String,
    mood:String,
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
});

const SongModel = mongoose.model('song' ,songSchema );

module.exports = SongModel;