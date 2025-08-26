export class ImageController {
  constructor(imageService) {
    this.imageService = imageService;
  }

  getImage = async (req, res, next) => {
    if (req.files) {
      // console.log(req.files);
      const files = req.files.map(f => ({
        name: f.originalname,
        path: f.path,
      }));
      // console.log(files);

      const urls = await this.imageService.getUrls(files);

      res.status(200).json({ urls });
    } else {
      return res.status(400).json({
        message: 'File should be an image file',
      });
    }
  };
}