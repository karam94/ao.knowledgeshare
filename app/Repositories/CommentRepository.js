"use strict";
const Comment = use("App/Models/Comment");

class CommentRepository {
  async delete(id, userId) {
    //TODO: only delete if comment belongs to the logged in user
    await Comment.query()
      .where("id", id)
      .where("user_id", userId)
      .delete();
  }

  async create(userId, postId, theComment) {
    const comment = await Comment.create({
      user_id: userId,
      post_id: postId,
      comment: theComment
    });
  }
}

module.exports = new CommentRepository();
