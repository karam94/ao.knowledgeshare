"use strict";

const Category = use("App/Models/Category");

class CategoryRepository {
  async get(id) {
    const category = await Category.query()
      .where("id", id)
      .firstOrFail();

    return category;
  }

  async getAll() {
    return await Category.pair("id", "name");
  }

  async create(name) {
    const category = await Category.create({
      name: name
    });

    return category;
  }
}

module.exports = new CategoryRepository();
