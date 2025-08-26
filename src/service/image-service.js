import ImageRepository from '../repository/image-repository.js';

export default class ImageService {
  constructor() {
    this.imageRepository = new ImageRepository();
  }

  getUrls = async (files) => {
    await this.imageRepository.insertMetadata(files);
    
    return files.map((f) => `http://localhost:${process.env.PORT}/` + f.path);
  }
}