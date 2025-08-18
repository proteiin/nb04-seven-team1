import ImageRepository from '../repository/ImageRepository.js';

export default class ImageService {
  constructor() {
    this.imageRepository = new ImageRepository();
  }

  getUrls = async (files) => {
    await this.imageRepository.insertMetadata(files);
    
    return files.map((f) => f.path);
  }
}