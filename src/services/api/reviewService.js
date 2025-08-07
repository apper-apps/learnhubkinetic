import reviewsData from "@/services/mockData/reviews.json";

class ReviewService {
  constructor() {
    this.reviews = [...reviewsData];
  }

  async getAll() {
    await this.delay();
    return [...this.reviews].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async getById(id) {
    await this.delay();
    return this.reviews.find(review => review.Id === id) || null;
  }

  async create(reviewData) {
    await this.delay();
    const newReview = {
      ...reviewData,
      Id: Math.max(...this.reviews.map(r => r.Id)) + 1,
      createdAt: new Date().toISOString()
    };
    this.reviews.push(newReview);
    return newReview;
  }

  async update(id, reviewData) {
    await this.delay();
    const index = this.reviews.findIndex(review => review.Id === id);
    if (index !== -1) {
      this.reviews[index] = { ...this.reviews[index], ...reviewData };
      return this.reviews[index];
    }
    throw new Error("Review not found");
  }

  async delete(id) {
    await this.delay();
    const index = this.reviews.findIndex(review => review.Id === id);
    if (index !== -1) {
      const deletedReview = this.reviews.splice(index, 1)[0];
      return deletedReview;
    }
    throw new Error("Review not found");
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, 200));
  }
}

export default new ReviewService();