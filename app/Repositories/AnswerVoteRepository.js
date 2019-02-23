"use strict";

const AnswerVote = use("App/Models/AnswerVote");

class AnswerVoteRepository {
  async getUserVote(userId, answerId){
    return await AnswerVote.query()
      .where("user_id", userId)
      .where("answer_id", answerId)
      .first();
  }

  async create(userId, answerId, isPositive){
    return await AnswerVote.create({
      user_id: userId,
      answer_id: answerId,
      is_positive: isPositive
    });
  }
}

module.exports = new AnswerVoteRepository();