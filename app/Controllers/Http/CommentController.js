"use strict";
const UserRepository = use("App/Repositories/UserRepository");

const Comment = use("App/Models/Comment");

class CommentController {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async delete({ request, response, session }) {
    const user = await this.userRepository.get(session.get("username"));

    const comment = await Comment.query()
      .where("id", request.input("comment_id"))
      .where("user_id", user.id)
      .delete();

    session.flash({
      notification: {
        type: "danger",
        message: "Comment deleted!"
      }
    });

    var route = "/post/details/" + request.input("post_id");
    return response.route(route);
  }
}

module.exports = CommentController;
