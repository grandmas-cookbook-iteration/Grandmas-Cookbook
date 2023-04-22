const { Configuration, OpenAIApi } = require('openai');
const fs = require('fs/promises');
const path = require('path');
const { Readable } = require('stream');
const { uploadeFileToS3 } = require('../utils/awsS3Connection');
import { Request, Response, NextFunction} from 'express';
import { RouteType } from './RouteType';

const configuration = new Configuration({
  apiKey: process.env.DALLE_KEY,
});

const openai = new OpenAIApi(configuration);

const convertStrToFileName = (str: String) =>
  `${str.toLowerCase().replace(/\s/gi, '-')}.jpg`;

interface dalleImageController {
  generateImage: RouteType
}

const dalleImageController: dalleImageController = {
  generateImage : async (req, res, next) => {
  console.log('reached generateImage');
  const { imagePath } = req.body;
  if (!imagePath) {
    try {
      const { title } = req.body;
      const response = await openai.createImage({
        prompt: title,
        n: 1,
        size: '256x256',
      });

      const imageUrl = response.data.data[0].url;
      const imageResponse = await fetch(imageUrl);
      const blob = await imageResponse.blob();
      const arrayBuffer = await blob.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const stream = Readable.from(buffer);
      const imageFileName = convertStrToFileName(title);

      // Save a file to local disk. Not used.
      /*
      await fs.writeFile(
        path.join(__dirname, '../../public/images/', imageFileName),
        buffer
      );
      */

      // Upload the image stream to AWS S3 bucket.
      /*
        TO-DO: 1. Add userid to the imageFileName to be saved in AWS S3.
        2. Any performance optimization for the process of fetching from DALL-E url and then uploading to AWS S3.
      */
      const s3result = await uploadeFileToS3(imageFileName, stream);

      res.locals.awsimagePath = s3result.Location;

      return next();
    } catch (error) {
      console.log("error in dalle-ai")
      return next({
        log: `Error encountered in dalleImageController.generateImage, ${error}`,
        message: 'Error encountered when generating image via the DallE AI.',
      });
    }
  } else {
    return next();
  }
},
}

module.exports = dalleImageController;