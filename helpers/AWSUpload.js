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
 accessKeyId: 'ASIATSB762EBUI4LJEPH',
 secretAccessKey: 'PN9miigd5q6SOwiU4Uzvyx6i/z/w0PLgwOfR7QOu',
 sessionToken : 'FwoGZXIvYXdzED0aDB3hy8XQLHxY3lJb2yLDAV6VKD9nudlpwRSWKYugWXCBGbIRexHT71gHc3VqIys4aDfnGNW0ejjpNexfuC6k/Bc7Exz4QmqhwDOFwkHm+ckbymjvbmyArKvvPiPoJy28WyNM6F0uHNfuswmXnkDemhPa4CSy/U4JeFNE51TYB76W3XaCpVb7bigV/w6wxMRa0Nr7ol0HdTBUPr3ohHd4EcbsdrpTD7O1GRo8tVLauCI7M4Ys5iTpF7WV9PYXvz51cTxNlh0rkHkwBuWV3XZcbaUU1Cjr86z2BTItNrPrrCCWjb1IKeXT7krxJS9Dwf/sSXfg8l1chiQzB88uSWg5lSwJ2ZjyAWQ9',
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