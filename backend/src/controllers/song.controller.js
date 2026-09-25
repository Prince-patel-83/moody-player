
const uploadFile = require('../services/storage.service.js')
const SongModel = require("../models/song.model");


const GetSongController = async (req , res)  =>{
    const {mood} = req.query;

    if(!mood){
        return res.status(400).json({
            message : "The request is missing required data",
            success : false
        })
    }

    const songs = await SongModel.find({
        mood:mood
    })

    if (songs.length === 0) {
        return res.status(404).json({
            message: "song not found",
            success: false
        });
    }


    console.log(songs);
    res.status(200).json({
        message:"song fetched sucessfully",
        songs:songs,
        success:true
    })
}

const UploadSongController = async (req,res)=>{

    const  {title , artist , mood } = req.body
    console.log(req.body);
    console.log(req.file);
    console.log("hitted backend");
    
    if(!title || !artist || !mood){
        return res.status(400).json({
            message:"title , artist , mood is required",
            success:false
        })
    }
    const fileData = await uploadFile(req.file);
    console.log("filedata -> ",fileData);
    
    const song = await SongModel.create({
        title:title,
        artist:artist,
        audio:fileData?.url,
        mood:mood,
        author:req.userId
    })


// for AI mood detection  
    // const det = await GetSongMood(fileData.url);
    // console.log("mood " , det);

    res.status(201).json({
        message: "song created sucessfully",
        songs: song,
        success : true
    });
    
}

module.exports  = {
    GetSongController,
    UploadSongController
}
