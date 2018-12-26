"use strict";

const Post = use("App/Models/Post");

class HomeController {
  async index({ view, request }) {
    const posts = await Post.query()
      .orderBy("id", "desc")
      .with("category")
      .with("poster")
      .with("likes")
      .with("comments")
      .paginate(Number(request.input("page", 1)), 10);

    return view.render("home", { posts: posts.toJSON() });
  }
}

module.exports = HomeController;
