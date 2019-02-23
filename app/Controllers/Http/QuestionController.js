"use strict";
const UserRepository = use("App/Repositories/UserRepository");
const CategoryRepository = use("App/Repositories/CategoryRepository");
const AnswerRepository = use("App/Repositories/AnswerRepository");
const QuestionRepository = use("App/Repositories/QuestionRepository");

const QuestionVote = use("App/Models/QuestionVote");

class QuestionController {
  async create({ view }) {
    const categories = await CategoryRepository.getAll();
    return view.render("question/create", { categories });
  }

  async add({ request, response, session }) {
    const user = await UserRepository.get(session.get("username"));

    var categoryId = request.input("category_id");

    if (categoryId === "0") {
      var category = await CategoryRepository.create(
        request.input("new_category_name")
      );

      await QuestionRepository.create(
        user.id,
        category.id,
        request.input("title"),
        request.input("description")
      );
    } else {
      await QuestionRepository.create(
        user.id,
        categoryId,
        request.input("title"),
        request.input("description")
      );
    }

    session.flash({
      notification: {
        type: "success",
        message: "Question added!"
      }
    });

    return response.route("home");
  }

  async details({ params, view, session }) {
    const user = await UserRepository.get(session.get("username"));
    const question = await QuestionRepository.getQuestionById(
      params.id,
      user.id
    );

    return view.render("question/details", {
      question: question.toJSON(),
      user: user.toJSON()
    });
  }

  async answer({ request, response, session }) {
    const user = await UserRepository.get(session.get("username"));
    const answer = await AnswerRepository.create(
      user.id,
      request.input("question_id"),
      request.input("answer")
    );

    session.flash({
      notification: {
        type: "success",
        message: "Answer added!"
      }
    });

    var route = "/question/details/" + request.input("question_id");
    return response.route(route);
  }

  async upvote({ request, response, session }) {
    const user = await UserRepository.get(session.get("username"));
    const question = await QuestionRepository.get(request.input("question_id"));

    const vote = await QuestionVote.query()
      .where("user_id", user.id)
      .where("question_id", request.input("question_id"))
      .first();

    if (vote && vote.is_positive) {
      vote.delete();

      question.score--;
      question.save();
    } else if (vote && !vote.is_positive) {
      vote.is_positive = true;

      question.score++;
      question.score++;
      question.save();

      await user.questionVotes().save(vote);
    } else {
      const newVote = new QuestionVote();
      newVote.user_id = user.id;
      newVote.question_id = request.input("question_id");
      newVote.is_positive = true;

      question.score++;
      question.save();

      await user.questionVotes().save(newVote);
    }

    return response.route("back");
  }

  async downvote({ request, response, session }) {
    const user = await UserRepository.get(session.get("username"));
    const question = await QuestionRepository.get(request.input("question_id"));

    const vote = await QuestionVote.query()
      .where("user_id", user.id)
      .where("question_id", request.input("question_id"))
      .first();

    if (vote && vote.is_positive) {
      vote.is_positive = false;

      question.score--;
      question.score--;
      question.save();

      await user.questionVotes().save(vote);
    } else if (vote && !vote.is_positive) {
      question.score++;
      question.save();

      vote.delete();
    } else {
      const newVote = new QuestionVote();
      newVote.user_id = user.id;
      newVote.question_id = request.input("question_id");
      newVote.is_positive = false;

      question.score--;
      question.save();

      await user.questionVotes().save(newVote);
    }

    return response.route("back");
  }
}

module.exports = QuestionController;
