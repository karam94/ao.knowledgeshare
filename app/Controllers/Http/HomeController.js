"use strict";
const UserRepository = use("App/Repositories/UserRepository");
const PostRepository = use("App/Repositories/PostRepository");
const QuestionRepository = use("App/Repositories/QuestionRepository");

class HomeController {
  async index({ view, request, session }) {
    const user = await UserRepository.get(session.get("username"));
    const posts = await PostRepository.getAllPaginated(
      request.input("postpage", 1),
      8
    );
    const questions = await QuestionRepository.getQuestions(
      user.id,
      Number(request.input("questionpage", 1)),
      5
    );

    return view.render("home", {
      user: user.toJSON(),
      posts: posts.toJSON(),
      questions: questions.toJSON(),
      title: "Home"
    });
  }
}

module.exports = HomeController;
