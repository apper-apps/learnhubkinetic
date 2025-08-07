import blogPostsData from "@/services/mockData/blogPosts.json";

class BlogService {
  constructor() {
    this.posts = [...blogPostsData];
  }

  async getAll() {
    await this.delay();
    return [...this.posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async getById(id) {
    await this.delay();
    return this.posts.find(post => post.Id === id) || null;
  }

  async create(postData) {
    await this.delay();
    const newPost = {
      ...postData,
      Id: Math.max(...this.posts.map(p => p.Id)) + 1,
      createdAt: new Date().toISOString()
    };
    this.posts.push(newPost);
    return newPost;
  }

  async update(id, postData) {
    await this.delay();
    const index = this.posts.findIndex(post => post.Id === id);
    if (index !== -1) {
      this.posts[index] = { ...this.posts[index], ...postData };
      return this.posts[index];
    }
    throw new Error("Post not found");
  }

  async delete(id) {
    await this.delay();
    const index = this.posts.findIndex(post => post.Id === id);
    if (index !== -1) {
      const deletedPost = this.posts.splice(index, 1)[0];
      return deletedPost;
    }
    throw new Error("Post not found");
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, 250));
  }
}

export default new BlogService();