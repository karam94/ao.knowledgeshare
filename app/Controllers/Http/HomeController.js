"use strict";
const UserRepository = use("App/Repositories/UserRepository");
const PostRepository = use("App/Repositories/PostRepository");
const QuestionRepository = use("App/Repositories/QuestionRepository");
const VideoRepository = use("App/Repositories/VideoRepository");

class HomeController {
  async index({ view, request, session }) {
    const user = await UserRepository.get(session.get("username"));
    const posts = await PostRepository.getAllPaginated(
      request.input("postpage", 1),
      8
    );
    const questions = await QuestionRepository.getQuestions(
      user.id,
      request.input("questionpage", 1),
      5
    );
    const videos = await VideoRepository.getAllPaginated(
      request.input("videopage", 1),
      8
    );

    return view.render("home", {
      user: user.toJSON(),
      posts: posts.toJSON(),
      questions: questions.toJSON(),
      videos: videos.toJSON(),
      title: "Home"
    });
  }
}

module.exports = HomeController;
