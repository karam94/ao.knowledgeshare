"use strict";
const UserRepository = use("App/Repositories/UserRepository");
const CategoryRepository = use("App/Repositories/CategoryRepository");
const VideoRepository = use("App/Repositories/VideoRepository");

const got = require("got");
const metascraper = require("metascraper")([
  require("metascraper-description")(),
  require("metascraper-image")(),
  require("metascraper-title")(),
  require("metascraper-url")()
]);

class VideoController {
  async create({ view }) {
    const categories = await CategoryRepository.getAll();
    return view.render("video/create", { categories });
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
      return view.render("video/create", {
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

      await VideoRepository.create(
        user.id,
        newCategory.id,
        metadata.title,
        metadata.description,
        metadata.image,
        metadata.url
      );
    } else {
      await VideoRepository.create(
        user.id,
        categoryId,
        metadata.title,
        metadata.description,
        metadata.image,
        metadata.url
      );
    }

    session.flash({
      notification: {
        type: "success",
        message: "Video created!"
      }
    });

    return response.route("home");
  }

  async details({ params, view, session }) {
    const user = await UserRepository.get(session.get("username"));
    const video = await VideoRepository.get(params.id);
    // const userLikesPost = await LikeRepository.userLikesPost(user.id, post.id);

    return view.render("video/details", {
      video: video.toJSON(),
      user: user.toJSON()
      // userLikesPost: userLikesPost > 0 ? true : false
    });
  }
}

module.exports = VideoController;
