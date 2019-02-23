"use strict";

const Post = use("App/Models/Post");

class PostRepository {
  async get(id) {
    return await Post.query()
      .where("id", id)
      .with("category")
      .with("poster")
      .with("likes")
      .with("comments.author")
      .firstOrFail();
  }

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

  async getPostsForUserProfile(userId, limit) {
    return await Post.query()
      .where("user_id", userId)
      .with("category")
      .with("poster")
      .with("likes")
      .with("comments")
      .orderBy("id", "desc")
      .limit(6)
      .fetch();
  }

  async create(userId, categoryId, author, title, description, image, url) {
    const post = await Post.create({
      user_id: userId,
      category_id: categoryId,
      author: author,
      title: title,
      description: description,
      image: image,
      url: url
    });
  }

  async delete(postId, userId) {
    await Post.query()
      .where("id", postId)
      .where("user_id", userId)
      .delete();
  }
}

module.exports = new PostRepository();
