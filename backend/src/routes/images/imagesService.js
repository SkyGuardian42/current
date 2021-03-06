import sharp from 'sharp';
import multer from 'multer';
import mongoose from 'mongoose';
import Image from '../../models/Image';
import config from '../../config';
import fs from 'fs';
import path from 'path';
import debug from 'debug';
const log = debug('service:images');

/**
 * Multer middleware for file upload
 */
export const uploadMiddleware = multer({
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      log(process.cwd());
      const filepath = path.join(process.cwd(), '/public/img'); 
      fs.mkdirSync(filepath, {recursive: true});
      cb(null, filepath);
    },
    filename: (req, file, cb) => {
      const name = new mongoose.Types.ObjectId();
      const ext = file.mimetype.split('/')[1];
      file.originalname = name;
      cb(null, `${name}`)
    }
  }),
  filter: (req, file, cb) => {
    console.log(file)
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload an image.'), false);
    }
  }
}).single('image')

/**
 * Creates the Database entry for a newly uploaded image
 * @param {Object} image Multer object of the uploaded image
 * @param {Object} user Object containing the uploading user
 */
export async function createImage(image, user) {
  if(!image)
    throw new Error("No image provided");

  // generate LQIP for given image, with a maximum
  // of 20px in either width or height
  const lqipData = await sharp(image.path)
    .resize(20, 20, {
      fit: sharp.fit.inside,
      withoutEnlargement: true
    })
    .toBuffer()

  // create a new entry in the database for the uploaded file 
  let imageDbEntry = new Image({
    _id: new mongoose.Types.ObjectId(image.originalname),
    _user: new mongoose.Types.ObjectId(user._id),
    format: image.mimetype.split('/')[1],
    url: config.backendUrl + '/images/' + image.filename,
    lqip: `data:image/png;base64,${lqipData.toString('base64')}`
  });
  imageDbEntry.save();
  
  return {
    _id: imageDbEntry._id,
    url: imageDbEntry.url,
    lqip: imageDbEntry.lqip
  }
}

/**
 * Gets the database info for a single image
 * @param {string} id ID of the image
 */
export async function getImageInfo(id) {
  return Image.findOne(id);
}

/**
 * Gets the database info for all images
 */
export async function getImagesInfo() {
  return Image.find();
}