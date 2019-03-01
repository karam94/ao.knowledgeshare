"use strict";
const UserRepository = use("App/Repositories/UserRepository");
const QuestionRepository = use("App/Repositories/QuestionRepository");
const QuestionVoteRepository = use("App/Repositories/QuestionVoteRepository");

class QuestionController {
  async upvote({ request, response, session }) {
    const user = await UserRepository.get(session.get("username"));
    const question = await QuestionRepository.get(request.input("question_id"));
    const vote = await QuestionVoteRepository.getUserVote(
      user.id,
      request.input("question_id"),
      true
    );
    var upvoted = false;

    if (vote && vote.is_positive) {
      vote.delete();

      question.score--;
      question.save();
    } else if (vote && !vote.is_positive) {
      vote.is_positive = true;
      upvoted = true;

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
      upvoted = true;

      question.score++;
      question.save();
    }

    return response.status(200).json({
      "upvoted": upvoted,
      "score": question.score
    });
  }

  async downvote({ request, response, session }) {
    
    const user = await UserRepository.get(session.get("username"));
    const question = await QuestionRepository.get(request.input("question_id"));
    const vote = await QuestionVoteRepository.getUserVote(
      user.id,
      request.input("question_id")
    );
    var downvoted = false;

    if (vote && vote.is_positive) {
      vote.is_positive = false;
      downvoted = true;
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
      downvoted = true;
      question.score--;
      question.save();
    }

    return response.status(200).json({
      "downvoted": downvoted,
      "score": question.score
    });
  }
}

module.exports = QuestionController;
