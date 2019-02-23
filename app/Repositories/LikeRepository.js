"use strict";
const Like = use("App/Models/Like");

class LikeRepository {
  async create(userId, postId) {
    await Like.create({
      user_id: userId,
      post_id: postId
    });
  }

  async delete(userId, postId) {
    await Like.query()
      .where("user_id", userId)
      .where("post_id", postId)
      .delete();
  }

  async userLikesPost(userId, postId) {
    const userLikesPost = await Like.query()
      .where("user_id", userId)
      .where("post_id", postId)
      .getCount();

    return userLikesPost;
  }
}

module.exports = new LikeRepository();
