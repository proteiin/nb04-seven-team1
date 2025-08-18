import express from 'express';
import ImageController from '../controller/ImageController.js';
import multer from 'multer';

export default class ImageRouter {
  constructor() {
    this.router = express.Router({ mergeParams: true });
    this.imageController = new ImageController();
    this.upload = multer({ dest: 'uploads/' });

    this.initializeRouter();
  }

  initializeRouter() {
    this.router
      .route('/')
      .post(
        this.upload.array('images', 5),
        this.imageController.getImage.bind(this.imageController),
      );
  }

  getRouter() {
    return this.router;
  }
}
