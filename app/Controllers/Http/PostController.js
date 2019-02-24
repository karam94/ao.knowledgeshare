"use strict";
const UserRepository = use("App/Repositories/UserRepository");
const CategoryRepository = use("App/Repositories/CategoryRepository");
const CommentRepository = use("App/Repositories/CommentRepository");
const PostRepository = use("App/Repositories/PostRepository");
const LikeRepository = use("App/Repositories/LikeRepository");

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
    const categories = await CategoryRepository.getAll();
    return view.render("post/create", { categories });
  }

  async add({ request, response, session, view }) {
    const user = await UserRepository.get(session.get("username"));

    const targetUrl = request.input("url");
    const { body: html, url } = await got(targetUrl);
    const metadata = await metascraper({ html, url });
    var containsMissingData = false;

    for (var member in metadata) {
      if (metadata[member] == null) containsMissingData = true;
    }

    var categoryId = request.input("category_id");

    if (containsMissingData) {
      const categories = await CategoryRepository.getAll();
      return view.render("post/create", {
        categories,
        postModify: true,
        postTitle: metadata.title,
        postDescription: metadata.description,
        postImage: metadata.image,
        postUrl: metadata.url
      });
    } else if (categoryId === "0") {
      var newCategory = await CategoryRepository.create(
        request.input("new_category_name")
      );

      await PostRepository.create(
        user.id,
        newCategory.id,
        metadata.author,
        metadata.title,
        metadata.description,
        metadata.image,
        metadata.url
      );
    } else {
      await PostRepository.create(
        user.id,
        categoryId,
        metadata.author,
        metadata.title,
        metadata.description,
        metadata.image,
        metadata.url
      );
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
    const user = await UserRepository.get(session.get("username"));
    await PostRepository.delete(request.input("post_id"), user.id);

    session.flash({
      notification: {
        type: "danger",
        message: "Post deleted!"
      }
    });

    return response.route("/");
  }

  async details({ params, view, session }) {
    const user = await UserRepository.get(session.get("username"));
    const post = await PostRepository.get(params.id);
    const userLikesPost = await LikeRepository.userLikesPost(user.id, post.id);

    return view.render("post/details", {
      post: post.toJSON(),
      user: user.toJSON(),
      userLikesPost: userLikesPost > 0 ? true : false
    });
  }

  async comment({ request, response, session }) {
    const user = await UserRepository.get(session.get("username"));
    const comment = CommentRepository.create(
      user.id,
      request.input("post_id"),
      request.input("comment")
    );

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
    const user = await UserRepository.get(session.get("username"));
    const existingLike = await LikeRepository.userLikesPost(
      user.id,
      request.input("post_id")
    );

    if (existingLike > 0) {
      await LikeRepository.deletePostLike(user.id, request.input("post_id"));
    } else {
      await LikeRepository.createPostLike(user.id, request.input("post_id"));
    }

    var route = "/post/details/" + request.input("post_id");
    return response.route(route);
  }
}

module.exports = PostController;
