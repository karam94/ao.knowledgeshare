"use strict";

const Post = use("App/Models/Post");

class PostRepository {
  async getAll() {
    return await Post.query()
      .orderBy("id", "desc")
      .with("category")
      .with("poster")
      .with("likes")
      .with("comments");
  }

  async getAllPaginated(page, limit) {
    return await Post.query()
      .orderBy("id", "desc")
      .with("category")
      .with("poster")
      .with("likes")
      .with("comments")
      .paginate(page, limit);
  }

  async getPostsByCategoryPaginated(categoryId, page, limit) {
    return await Post.query()
      .orderBy("id", "desc")
      .where("category_id", categoryId)
      .with("category")
      .with("poster")
      .with("likes")
      .with("comments")
      .paginate(page, limit);
  }

  async getPostsByCategoriesPaginated(categories, page, limit) {
    return await Post.query()
      .orderBy("id", "desc")
      .whereIn("category_id", categories)
      .with("category")
      .with("poster")
      .with("likes")
      .with("comments")
      .paginate(page, limit);
  }
}

module.exports = new PostRepository();
