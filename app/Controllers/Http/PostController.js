"use strict";

const Category = use("App/Models/Category");
const User = use("App/Models/User");
const Post = use("App/Models/Post");
const got = require("got");
const metascraper = require("metascraper")([
  require("metascraper-author")(),
  require("metascraper-description")(),
  require("metascraper-image")(),
  require("metascraper-title")(),
  require("metascraper-url")()
]);

class PostController {
  async create({ view }) {
    const categories = await Category.pair("id", "name");
    return view.render("post/create", { categories });
  }

  async add({ request, response, session }) {
    const user = await User.findByOrFail("username", session.get("username"));

    const targetUrl = request.input("url");
    const { body: html, url } = await got(targetUrl);
    const metadata = await metascraper({ html, url });

    const post = new Post();
    post.category_id = request.input("category_id");
    post.author = metadata.author;
    post.title = metadata.title;
    post.description = metadata.description;
    post.image = metadata.image;
    post.url = metadata.url;
    await user.posts().save(post);

    session.flash({
      notification: {
        type: "success",
        message: "Post created!"
      }
    });

    return response.route("home");
  }

  async details({ params, view }) {
    const post = await Post.query()
      .where("id", params.id)
      .with("category")
      .with("poster")
      .with("likes")
      .with("comments")
      .firstOrFail();

    return view.render("post/details", {
      post: post.toJSON()
    });
  }
}

module.exports = PostController;
