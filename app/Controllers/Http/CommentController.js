"use strict";
const UserRepository = use("App/Repositories/UserRepository");
const CommentRepository = use("App/Repositories/CommentRepository");

class CommentController {
  async delete({ request, response, session }) {
    const user = await UserRepository.get(session.get("username"));
    const comment = await CommentRepository.delete(
      request.input("comment_id"),
      user.id
    );

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
