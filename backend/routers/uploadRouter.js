import express from 'express';
import multer from 'multer';
import config from '../config.js';
import { isAuth } from '../utils.js';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

const upload = multer();

const uploadRouter = express.Router();

uploadRouter.post(
  '/dinary',
  isAuth,
  upload.single('file'),
  async (req, res) => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });
    const streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };
    const result = await streamUpload(req);
    res.send(result);
  }
);



export default uploadRouter;