const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config ({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUR_API_KEY,
    api_secret: process.env.CLOUR_API_SECRET,

})

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'workerfinder_dev',
   allowformate: ["png" , "jpg" ,"jpej"],
   
  },
});

module.exports = {
    cloudinary, storage ,
}