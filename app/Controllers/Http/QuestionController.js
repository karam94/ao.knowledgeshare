"use strict";
const UserRepository = use("App/Repositories/UserRepository");
const CategoryRepository = use("App/Repositories/CategoryRepository");
const AnswerRepository = use("App/Repositories/AnswerRepository");
const QuestionRepository = use("App/Repositories/QuestionRepository");
const QuestionVoteRepository = use("App/Repositories/QuestionVoteRepository");

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
    const vote = await QuestionVoteRepository.getUserVote(
      user.id,
      request.input("question_id"),
      true
    );

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
      const newVote = await QuestionVoteRepository.create(
        user.id,
        request.input("question_id"),
        true
      );

      question.score++;
      question.save();
    }

    return response.route("back");
  }

  // TODO: Let's make some separate API controllers and need to set header X-XSRF-TOKEN with each ajax request
  // async upvote_api({ request, response, session }) {
  //   const user = await UserRepository.get(session.get("username"));
  //   const question = await QuestionRepository.get(request.input("question_id"));
  //   const vote = await QuestionVoteRepository.getUserVote(
  //     user.id,
  //     request.input("question_id"),
  //     true
  //   );

  //   if (vote && vote.is_positive) {
  //     vote.delete();

  //     question.score--;
  //     question.save();
  //   } else if (vote && !vote.is_positive) {
  //     vote.is_positive = true;

  //     question.score++;
  //     question.score++;
  //     question.save();

  //     await user.questionVotes().save(vote);
  //   } else {
  //     const newVote = await QuestionVoteRepository.create(
  //       user.id,
  //       request.input("question_id"),
  //       true
  //     );

  //     question.score++;
  //     question.save();
  //   }

  //   return response.status(200);
  // }




  async downvote({ request, response, session }) {
    const user = await UserRepository.get(session.get("username"));
    const question = await QuestionRepository.get(request.input("question_id"));
    const vote = await QuestionVoteRepository.getUserVote(
      user.id,
      request.input("question_id")
    );

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
      const newVote = await QuestionVoteRepository.create(
        user.id,
        request.input("question_id"),
        false
      );

      question.score--;
      question.save();
    }

    return response.route("back");
  }
}

module.exports = QuestionController;
