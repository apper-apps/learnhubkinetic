import videosData from "@/services/mockData/videos.json";

class VideoService {
  constructor() {
    this.videos = [...videosData];
  }

  async getAll() {
    await this.delay();
    return [...this.videos].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }

  async getById(id) {
    await this.delay();
    return this.videos.find(video => video.Id === id) || null;
  }

  async getBySection(section) {
    await this.delay();
    return this.videos
      .filter(video => video.section === section)
      .sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
  }

  async create(videoData) {
    await this.delay();
    const newVideo = {
      ...videoData,
      Id: Math.max(...this.videos.map(v => v.Id)) + 1,
      isPinned: false,
      createdAt: new Date().toISOString()
    };
    this.videos.push(newVideo);
    return newVideo;
  }

  async update(id, videoData) {
    await this.delay();
    const index = this.videos.findIndex(video => video.Id === id);
    if (index !== -1) {
      this.videos[index] = { ...this.videos[index], ...videoData };
      return this.videos[index];
    }
    throw new Error("Video not found");
  }

  async delete(id) {
    await this.delay();
    const index = this.videos.findIndex(video => video.Id === id);
    if (index !== -1) {
      const deletedVideo = this.videos.splice(index, 1)[0];
      return deletedVideo;
    }
    throw new Error("Video not found");
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, 300));
  }
}

export default new VideoService();