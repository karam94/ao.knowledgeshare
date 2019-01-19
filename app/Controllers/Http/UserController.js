"use strict";

const User = use("App/Models/User");
const Post = use("App/Models/Post");
const Question = use("App/Models/Question");

class UserController {
  async index({ view, request, params, session }) {
    // becomes "is logged in user etc"
    const user = await User.query()
      .where("username", session.get("username"))
      .firstOrFail();

    const profileUser = await User.query()
      .where("username", params.username)
      .withCount("posts")
      .withCount("questions")
      .withCount("answers")
      .withCount("likes")
      .firstOrFail();

    const posts = await Post.query()
      .where("user_id", profileUser.id)
      .with("category")
      .with("poster")
      .with("likes")
      .with("comments")
      .orderBy("id", "desc")
      .limit(6)
      .fetch();

    var questions = await Question.query()
      .where("user_id", profileUser.id)
      .with("category")
      .with("poster")
      .with("answers")
      .with("upvotes", builder => {
        builder.where("is_positive", true);
      })
      .with("downvotes", builder => {
        builder.where("is_positive", false);
      })
      .orderBy("id", "desc")
      .limit(6)
      .fetch();

    return view.render("user/profile", {
      user: profileUser.toJSON(),
      posts: posts.toJSON(),
      questions: questions.toJSON(),
      title: params.username
    });
  }
}

module.exports = UserController;
