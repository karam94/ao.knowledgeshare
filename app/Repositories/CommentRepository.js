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

  async createPostComment(userId, postId, theComment) {
    const comment = await Comment.create({
      user_id: userId,
      post_id: postId,
      comment: theComment
    });
  }

  async createVideoComment(userId, videoId, theComment) {
    const comment = await Comment.create({
      user_id: userId,
      video_id: videoId,
      comment: theComment
    });
  }
}

module.exports = new CommentRepository();
