"use strict";

const User = use("App/Models/User");
const Question = use("App/Models/Question");

class UserController {
  async index({ view, request, params, session }) {
    // becomes "is logged in user etc"
    const user = await User.query()
      .where("username", session.get("username"))
      .firstOrFail();

    const profileUser = await User.query()
      .where("username", params.username)
      .firstOrFail();

    var questions = await Question.query()
      .where("user_id", profileUser.id)
      .with("category")
      .with("upvotes", builder => {
        builder.where("is_positive", true);
      })
      .with("downvotes", builder => {
        builder.where("is_positive", false);
      })
      .orderBy("score", "desc")
      .limit(5)
      .fetch();

    return view.render("user/profile", {
      user: profileUser.toJSON(),
      questions: questions.toJSON(),
      title: params.username
    });
  }
}

module.exports = UserController;
