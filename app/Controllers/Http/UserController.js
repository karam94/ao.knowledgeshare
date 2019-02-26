"use strict";
const UserRepository = use("App/Repositories/UserRepository");
const AnswerRepository = use("App/Repositories/AnswerRepository");
const PostRepository = use("App/Repositories/PostRepository");
const QuestionRepository = use("App/Repositories/QuestionRepository");

const Location = use("App/Models/Location");

//const Badge = use("App/Models/Badge");

class UserController {
  async index({ view, request, params, session }) {
    const user = await UserRepository.get(session.get("username"));
    const profileUser = await UserRepository.getProfileUser(params.username);
    const posts = await PostRepository.getPostsForUserProfile(
      profileUser.id,
      6
    );

    var questions = await QuestionRepository.getQuestionsForUserProfile(
      profileUser.id,
      6
    );

    var answers = await AnswerRepository.getUserAnswers(profileUser.id);
    const locations = await Location.all();

    return view.render("user/profile", {
      user: user.toJSON(),
      profileUser: profileUser.toJSON(),
      posts: posts.toJSON(),
      questions: questions.toJSON(),
      answers: answers.toJSON(),
      title: params.username,
      locations: locations.toJSON()
    });
  }

  async edit({ request, response, session }) {
    const user = await UserRepository.get(session.get("username"));
    user.description = request.input("userDescription");
    user.location_id = request.input("location_id");
    await user.save();

    return response.route("/user/" + user.username);
  }
}

module.exports = UserController;
