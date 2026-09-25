const ImageKit = require('imagekit');
const mongoose = require("mongoose");

const imagekit = new ImageKit({
  publicKey: process.env['IMAGEKIT_PUBLIC_KEY'],
  privateKey: process.env['IMAGEKIT_PRIVATE_KEY'], 
  urlEndpoint: process.env['IMAGEKIT_END_URL'],
});


function uploadFile(file){

    return new Promise(( resolve,reject )=>{

        imagekit.upload({
            file:file.buffer,
            fileName: new mongoose.Types.ObjectId().toString(),
            folder : "Moody-player",
        },(error , result)=>{
            if(error) reject(error);
            else resolve(result);
        })

    });
}


module.exports = uploadFile;