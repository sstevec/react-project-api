const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "profile_pictures", // Cloudinary folder name
        allowed_formats: ["jpg", "jpeg", "png"],
    },
});

const upload = multer({ storage: storage });

module.exports = upload;
