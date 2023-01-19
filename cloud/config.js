const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')

cloudinary.config({
    cloud_name:process.env.cloud_name,
    api_secret:process.env.APISECRET,
    api_key:process.env.APIKEY
})



const Storage = new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        folder:'socialMedia'
    }
})


module.exports = {
    Storage,
    cloudinary
}