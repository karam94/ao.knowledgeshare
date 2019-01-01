"use strict";

const Post = use("App/Models/Post");
const Category = use("App/Models/Category");

class CategoryController {
  async index({ view, request, params }) {
    const posts = await Post.query()
      .orderBy("id", "desc")
      .where("category_id", params.category_id)
      .with("category")
      .with("poster")
      .with("likes")
      .with("comments")
      .paginate(Number(request.input("page", 1)), 10);

    const category = await Category.query()
      .where("id", params.category_id)
      .firstOrFail();

    return view.render("home", { posts: posts.toJSON(), category: category.name });
  }
}

module.exports = CategoryController;
