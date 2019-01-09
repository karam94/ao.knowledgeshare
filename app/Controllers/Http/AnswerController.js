"use strict";

const User = use("App/Models/User");
const Answer = use("App/Models/Answer");
const AnswerVote = use("App/Models/AnswerVote");

class AnswerController {
  async upvote({ request, response, session }) {
    const user = await User.findByOrFail("username", session.get("username"));

    const vote = await AnswerVote.query()
      .where("user_id", user.id)
      .where("answer_id", request.input("answer_id"))
      .first();

    if(vote && vote.is_positive){
      vote.delete();
    } else if (vote && !vote.is_positive){
      vote.is_positive = true;

      await user.answerVotes().save(vote);
    } else {
      const newVote = new AnswerVote();
      newVote.user_id = user.id;
      newVote.answer_id = request.input("answer_id");
      newVote.is_positive = true;
      
      await user.answerVotes().save(newVote);
    }

    return response.route("back");
  }
}

module.exports = AnswerController;
