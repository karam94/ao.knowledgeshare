"use strict";

const Category = use("App/Models/Category");
const User = use("App/Models/User");
const Post = use("App/Models/Post");

class PostController {
  async create({ view }) {
    const categories = await Category.pair("id", "name");
    return view.render("post/create", { categories });
  }

  async add({ request, response, session }) {
    const user = await User.findByOrFail("username", session.get("username"));

    const post = new Post();
    post.title = request.input("title");
    post.category_id = request.input("category_id");
    post.text = request.input("text");
    post.url = request.input("url");
    await user.posts().save(post);

    session.flash({
      notification: {
        type: "success",
        message: "Post created!"
      }
    });

    return response.route("home");
  }
}

module.exports = PostController;
