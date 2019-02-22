"use strict";
const UserRepository = use("App/Repositories/UserRepository");

const Post = use("App/Models/Post");
const Question = use("App/Models/Question");
const Answer = use("App/Models/Answer");
const Badge = use("App/Models/Badge");

class UserController {
  async index({ view, request, params, session }) {
    const user = await UserRepository.get(session.get("username"));
    const profileUser = await UserRepository.getProfileUser(params.username);

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

    var answers = await Answer.query()
      .where("user_id", profileUser.id)
      .with("question")
      .limit(6)
      .fetch();

    //var test = questions.toJSON();

    return view.render("user/profile", {
      user: user.toJSON(),
      profileUser: profileUser.toJSON(),
      posts: posts.toJSON(),
      questions: questions.toJSON(),
      answers: answers.toJSON(),
      title: params.username
    });
  }

  async edit({ request, response, session }) {
    const user = await UserRepository.get(session.get("username"));
    user.description = request.input("userDescription");
    await user.save();

    return response.route("/user/" + user.username);
  }
}

module.exports = UserController;
