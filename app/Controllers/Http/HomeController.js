"use strict";
const UserRepository = use("App/Repositories/UserRepository");
const PostRepository = use("App/Repositories/PostRepository");

const Question = use("App/Models/Question");
const QuestionVote = use("App/Models/QuestionVote");

class HomeController {
  constructor() {
    this.postRepository = new PostRepository();
  }

  async index({ view, request, session }) {
    const user = await UserRepository.get(session.get("username"));

    const posts = await this.postRepository.getAllPaginated(
      request.input("postpage", 1),
      8
    );

    var questions = await Question.query()
      .with("category")
      .with("poster")
      .with("upvotes", builder => {
        builder.where("user_id", user.id);
        builder.where("is_positive", true);
      })
      .with("downvotes", builder => {
        builder.where("user_id", user.id);
        builder.where("is_positive", false);
      })
      .with("answers.author")
      .orderBy("score", "desc")
      .paginate(Number(request.input("questionpage", 1)), 5);

    return view.render("home", {
      user: user.toJSON(),
      posts: posts.toJSON(),
      questions: questions.toJSON(),
      title: "Home"
    });
  }
}

module.exports = HomeController;
