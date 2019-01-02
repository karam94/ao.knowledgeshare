"use strict";

const Category = use("App/Models/Category");
const User = use("App/Models/User");
const Post = use("App/Models/Post");
const Comment = use("App/Models/Comment");
const Like = use("App/Models/Like");

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

    var categoryId = request.input("category_id");

    if (categoryId === "0") {
      const category = new Category();
      category.name = request.input("new_category_name");
      await category.save();

      const post = new Post();
      post.category_id = category.id;
      post.author = metadata.author;
      post.title = metadata.title;
      post.description = metadata.description;
      post.image = metadata.image;
      post.url = metadata.url;
      await user.posts().save(post);
    } else {
      const post = new Post();
      post.category_id = categoryId;
      post.author = metadata.author;
      post.title = metadata.title;
      post.description = metadata.description;
      post.image = metadata.image;
      post.url = metadata.url;
      await user.posts().save(post);
    }

    session.flash({
      notification: {
        type: "success",
        message: "Post created!"
      }
    });

    return response.route("home");
  }

  async delete({ request, response, session }) {
    const user = await User.findByOrFail("username", session.get("username"));

    const post = await Post.query()
      .where("id", request.input("post_id"))
      .where("user_id", user.id)
      .delete();

    session.flash({
      notification: {
        type: "danger",
        message: "Post deleted!"
      }
    });

    return response.route("/");
  }

  async details({ params, view, session }) {
    const user = await User.query()
      .where("username", session.get("username"))
      .firstOrFail();

    const post = await Post.query()
      .where("id", params.id)
      .with("category")
      .with("poster")
      .with("likes")
      .with("comments.author")
      .firstOrFail();

    const userLikesPost = await Like.query()
      .where("user_id", user.id)
      .where("post_id", post.id)
      .first();

    return view.render("post/details", {
      post: post.toJSON(),
      user: user.toJSON(),
      userLikesPost: userLikesPost ? true : false
    });
  }

  async comment({ request, response, session }) {
    const user = await User.findByOrFail("username", session.get("username"));

    const comment = new Comment();
    comment.user_id = user.id;
    comment.post_id = request.input("post_id");
    comment.comment = request.input("comment");
    await user.comments().save(comment);

    session.flash({
      notification: {
        type: "success",
        message: "Comment added!"
      }
    });

    var route = "/post/details/" + request.input("post_id");
    return response.route(route);
  }

  async like({ request, response, session }) {
    const user = await User.findByOrFail("username", session.get("username"));

    const existingLike = await Like.query()
      .where("user_id", user.id)
      .where("post_id", request.input("post_id"))
      .getCount();

    if (existingLike > 0) {
      await Like.query()
        .where("user_id", user.id)
        .where("post_id", request.input("post_id"))
        .delete();
    } else {
      const like = new Like();
      like.user_id = user.id;
      like.post_id = request.input("post_id");
      await user.likes().save(like);
    }

    var route = "/post/details/" + request.input("post_id");
    return response.route(route);
  }
}

module.exports = PostController;
