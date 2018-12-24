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
    const user = await User.findOrFail("username", session.get("username"));

    const post = new Post();
  }
  // async store({ request, response, auth, session }) {
  //   const user = auth.user;

  //   const logo = await this._processLogoUpload(request);

  //   if (!logo.moved()) {
  //     session.flash({
  //       notification: {
  //         type: "danger",
  //         message: logo.error().message
  //       }
  //     });

  //     return response.redirect("back");
  //   }

  //   const podcast = new Podcast();
  //   podcast.title = request.input("title");
  //   podcast.category_id = request.input("category_id");
  //   podcast.description = request.input("description");
  //   podcast.logo = `uploads/logos/${logo.fileName}`;

  //   await user.podcast().save(podcast);

  //   session.flash({
  //     notification: {
  //       type: "success",
  //       message: "Podcast created!"
  //     }
  //   });

  //   return response.route("myPodcast");
  // }
}

module.exports = PostController;
