"use strict";

const User = use("App/Models/User");
const Post = use("App/Models/Post");
const Question = use("App/Models/Question");
const Badge = use("App/Models/Badge");

class UserController {
  async index({ view, request, params, session }) {
    const profileUserId = await User.query()
      .where("username", params.username)
      .pluck("id");

    const profileUser = await User.query()
      .where("username", params.username)
      .with("badges", builder => {
        builder.where("user_id", profileUserId);
      })
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

    // const userBadges = await Badge.query()
    //   .with("badges", builder => {
    //     builder.where("user_id", profileUser.id);
    //   })
    //   .orderBy("id", "desc")
    //   .fetch();

    var test = profileUser.toJSON();

    return view.render("user/profile", {
      user: profileUser.toJSON(),
      //badges: userBadges.toJSON(),
      posts: posts.toJSON(),
      questions: questions.toJSON(),
      title: params.username
    });
  }
}

module.exports = UserController;
