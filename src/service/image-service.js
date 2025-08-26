export class ImageService {
  constructor(imageRepository) {
    this.imageRepository = imageRepository;
  }

  getUrls = async (files) => {
    await this.imageRepository.insertMetadata(files);
    
    return files.map((f) => `http://localhost:${process.env.PORT}/` + f.path);
  }
}