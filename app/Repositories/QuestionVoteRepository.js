"use strict";

const QuestionVote = use("App/Models/QuestionVote");

class QuestionVoteRepository {
  async getUserVote(userId, questionId){
    return await QuestionVote.query()
      .where("user_id", userId)
      .where("question_id", questionId)
      .first();
  }

  async create(userId, questionId, isPositive){
    return await QuestionVote.create({
      user_id: userId,
      question_id: questionId,
      is_positive: isPositive
    });
  }
}

module.exports = new QuestionVoteRepository();