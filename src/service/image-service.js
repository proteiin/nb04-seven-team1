export class ImageService {
  constructor(imageRepository) {
    this.imageRepository = imageRepository;
  }

  getUrls = async (files) => {
    await this.imageRepository.insertMetadata(files);
    
    return files.map((f) => `https://nb04-seven-team1.onrender.com/` + f.path);
  }
}
