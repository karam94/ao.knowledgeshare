"use strict";

const User = use("App/Models/User");
const Post = use("App/Models/Post");
const Question = use("App/Models/Question");

class HomeController {
  async index({ view, request, session }) {
    const user = await User.query()
      .where("username", session.get("username"))
      .firstOrFail();

    const posts = await Post.query()
      .orderBy("id", "desc")
      .with("category")
      .with("poster")
      .with("likes")
      .with("comments")
      .paginate(Number(request.input("page", 1)), 10);

    const questions = await Question.query()
      .orderBy("id", "desc")
      .with("category")
      .with("poster")
      .with("upvotes", (builder) => {
        builder.where("user_id", user.id);
        builder.where("is_positive", true);
      })
      .with("downvotes", (builder) => {
        builder.where("user_id", user.id);
        builder.where("is_positive", false);
      })
      .with("answers.author")
      .paginate(Number(request.input("page", 1)), 10);

    return view.render("home", {
      user: user.toJSON(),
      posts: posts.toJSON(),
      questions: questions.toJSON(),
      title: "Home"
    });
  }
}

module.exports = HomeController;
