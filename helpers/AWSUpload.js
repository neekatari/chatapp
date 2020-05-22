const express = require( 'express' );
const aws = require( 'aws-sdk' );
const multerS3 = require( 'multer-s3' );
const multer = require('multer');
const path = require( 'path' );

/**
 * express.Router() creates modular, mountable route handlers
 * A Router instance is a complete middleware and routing system; for this reason, it is often referred to as a “mini-app”.
 */
const router = express.Router();
/**
 * PROFILE IMAGE STORING STARTS
 */
const s3 = new aws.S3({
 accessKeyId: 'ASIATSB762EB2L2N7FVP',
 secretAccessKey: '8DE36a6mJmHKtBUTfLyfhs7dFR4SqiHqPlgEuAxf',
 sessionToken : 'FwoGZXIvYXdzEBAaDGx8vD8JYKZU0ayRoyLDAVb1za9JFA7Nj993cBO5DC21QTdT8hpJNasR08h3NjEojs9nk6xTiwkd7oUiVn+rIiQ6PriVG0Q21TrZmKS4Lrd9QG//p/9evt1YdObng/OxsOnSoQsy550Tk/JfkU+FYRPCqtQ+Xd4YP2UEBZR/MwfkqmojxTxlsNw4gVCHdH3vJ48TH/GMNdx3vfHcj+6S6l5GT596GLgFNSl18axbrtc8C5fLXnbaGI7dAtSqsULPCKI3W2VR8ZMPsdY8e9JkTyUCIyj+7In0BTItIPQ+86AdRSvX4lSe5/mE4Rqwm4ILuGTiX+s4cV6gBJPJqYMq6fbEjM495xEe',
 Bucket: 'hashchatapp'
});
/**
 * Single Upload
 */
const profileImgUpload = multer({
 storage: multerS3({
  s3: s3,
  bucket: 'hashchatapp',
  acl: 'public-read',
  key: function (req, file, cb) {
      console.log('hello', file);
   //cb(null, path.basename( file.originalname, path.extname( file.originalname ) ) + '-' + Date.now() + path.extname( file.originalname ) )
   cb(null,file.originalname)
   }
 }),
 limits:{ fileSize: 10000000 }, // In bytes: 10000000 bytes = 10 MB
 fileFilter: function( req, file, cb ){
  checkFileType( file, cb );
 }
}).any();



function checkFileType( file, cb ){
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test( path.extname( file.originalname ).toLowerCase());
    // Check mime
    const mimetype = filetypes.test( file.mimetype );
   if( mimetype && extname ){
     return cb( null, true );
    } else {
     cb( 'Error: Images Only!' );
    }
}

exports.ProfileImgUpload = profileImgUpload;