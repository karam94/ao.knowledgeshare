"use strict";
const UserRepository = use("App/Repositories/UserRepository");
const AnswerRepository = use("App/Repositories/AnswerRepository");

const AnswerVote = use("App/Models/AnswerVote");

class AnswerController {
  async upvote({ request, response, session }) {
    const user = await UserRepository.get(session.get("username"));

    const answer = await AnswerRepository.get(request.input("answer_id"));

    const vote = await AnswerVote.query()
      .where("user_id", user.id)
      .where("answer_id", request.input("answer_id"))
      .first();

    if (vote && vote.is_positive) {
      vote.delete();

      answer.score--;
      answer.save();
    } else if (vote && !vote.is_positive) {
      vote.is_positive = true;

      answer.score++;
      answer.score++;
      answer.save();

      await user.answerVotes().save(vote);
    } else {
      const newVote = new AnswerVote();
      newVote.user_id = user.id;
      newVote.answer_id = request.input("answer_id");
      newVote.is_positive = true;

      answer.score++;
      answer.save();

      await user.answerVotes().save(newVote);
    }

    return response.route("back");
  }

  async downvote({ request, response, session }) {
    const user = await UserRepository.get(session.get("username"));

    const answer = await AnswerRepository.get(request.input("answer_id"));

    const vote = await AnswerVote.query()
      .where("user_id", user.id)
      .where("answer_id", request.input("answer_id"))
      .first();

    if (vote && vote.is_positive) {
      vote.is_positive = false;

      answer.score--;
      answer.score--;
      answer.save();

      await user.answerVotes().save(vote);
    } else if (vote && !vote.is_positive) {
      answer.score++;
      answer.save();

      vote.delete();
    } else {
      const newVote = new AnswerVote();
      newVote.user_id = user.id;
      newVote.answer_id = request.input("answer_id");
      newVote.is_positive = false;

      answer.score--;
      answer.save();

      await user.answerVotes().save(newVote);
    }

    return response.route("back");
  }
}

module.exports = AnswerController;
