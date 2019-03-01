"use strict";
const UserRepository = use("App/Repositories/UserRepository");
const QuestionRepository = use("App/Repositories/QuestionRepository");
const QuestionVoteRepository = use("App/Repositories/QuestionVoteRepository");

class QuestionController {
  //TODO: Let's make some separate API controllers and need to set header X-XSRF-TOKEN with each ajax request
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

    return response.status(200).json(null);
  }
}

module.exports = QuestionController;
