import express from 'express';
import multer from 'multer';

const router = express.Router({ mergeParams: true });
const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true); // 이미지면 통과
    } else {
      const error = new Error('File should be an image file'); // 이미지가 아니면 에러 발생
      error.statusCode = 400; 
      cb(error,false)
    }
  },
});

export default (imageController) => {
  router
    .route('/')
    .post(
      upload.array('files', 3),
      imageController.getImage.bind(imageController),
    );

  return router;
};

/* export default class ImageRouter {
  constructor() {
    this.router = express.Router({ mergeParams: true });
    this.imageController = new ImageController();
    this.upload = multer({
      dest: 'uploads/',
      fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
          cb(null, true); // 이미지면 통과
        } else {
          const error = new Error('File should be an image file'); // 이미지가 아니면 에러 발생
          err.statusCode = 400; 
          cb(error,false)
        }
      },
    });

    this.initializeRouter();
  }

  initializeRouter() {
    this.router
      .route('/')
      .post(
        this.upload.array('files', 5),
        this.imageController.getImage.bind(this.imageController),
      );
  }

  getRouter() {
    return this.router;
  }
} */
