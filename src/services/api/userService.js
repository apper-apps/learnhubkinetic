import usersData from "@/services/mockData/users.json";

class UserService {
  constructor() {
    this.users = [...usersData];
  }

  async getAll() {
    await this.delay();
    return [...this.users].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async getById(id) {
    await this.delay();
    return this.users.find(user => user.Id === id) || null;
  }

  async create(userData) {
    await this.delay();
    const newUser = {
      ...userData,
      Id: Math.max(...this.users.map(u => u.Id)) + 1,
      role: userData.role || "free",
      createdAt: new Date().toISOString()
    };
    this.users.push(newUser);
    return newUser;
  }

  async update(id, userData) {
    await this.delay();
    const index = this.users.findIndex(user => user.Id === id);
    if (index !== -1) {
      this.users[index] = { ...this.users[index], ...userData };
      return this.users[index];
    }
    throw new Error("User not found");
  }

  async delete(id) {
    await this.delay();
    const index = this.users.findIndex(user => user.Id === id);
    if (index !== -1) {
      const deletedUser = this.users.splice(index, 1)[0];
      return deletedUser;
    }
    throw new Error("User not found");
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, 350));
  }
}

export default new UserService();