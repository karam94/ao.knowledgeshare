"use strict";

const Answer = use("App/Models/Answer");

class AnswerRepository {
  async get(id) {
    const answer = await Answer.query()
      .where("id", id)
      .firstOrFail();

    return answer;
  }
  
  async getUserAnswers(id) {
    const answers = await Answer.query()
      .where("user_id", id)
      .with("question")
      .with("author")
      .limit(6)
      .fetch();

    return answers;
  }

  async create(userId, questionId, theAnswer) {
    const createdAnswer = await Answer.create({
      user_id: userId,
      question_id: questionId,
      answer: theAnswer
    });

    return createdAnswer;
  }
}

module.exports = new AnswerRepository();