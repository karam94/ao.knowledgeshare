"use strict";
const UserRepository = use("App/Repositories/UserRepository");
const AnswerRepository = use("App/Repositories/AnswerRepository");
const AnswerVoteRepository = use("App/Repositories/AnswerVoteRepository");

class AnswerController {
  async upvote({ request, response, session }) {
    const user = await UserRepository.get(session.get("username"));
    const answer = await AnswerRepository.get(request.input("answer_id"));
    const vote = await AnswerVoteRepository.getUserVote(
      user.id,
      request.input("answer_id")
    );

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
      const newVote = await AnswerVoteRepository.create(
        user.id,
        request.input("answer_id"),
        true
      );

      answer.score++;
      answer.save();
    }

    return response.route("back");
  }

  async downvote({ request, response, session }) {
    const user = await UserRepository.get(session.get("username"));
    const answer = await AnswerRepository.get(request.input("answer_id"));
    const vote = await AnswerVoteRepository.getUserVote(
      user.id,
      request.input("answer_id")
    );

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
      const newVote = await AnswerVoteRepository.create(
        user.id,
        request.input("answer_id"),
        false
      );

      answer.score--;
      answer.save();
    }

    return response.route("back");
  }

  async correct({ request, response, session }) {
    const answer = await AnswerRepository.get(request.input("answer_id"));

    if(answer.is_correct){
      answer.is_correct = false;
      await answer.save();
    } else {
      const questionAnswers = await AnswerRepository.getQuestionCorrectAnswers(request.input("question_id"));

      if(questionAnswers > 0){
        session.flash({
          notification: {
            type: "danger",
            message: "You have already selected a correct answer for this question!"
          }
        });
      } else {
        answer.is_correct = true;
        await answer.save();
      }
    }

    var route = "/question/details/" + request.input("question_id");
    return response.route(route);
  }
}

module.exports = AnswerController;
