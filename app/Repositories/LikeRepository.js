"use strict";
const Like = use("App/Models/Like");
const Video = use("App/Models/Video");

class LikeRepository {
  async createPostLike(userId, postId) {
    await Like.create({
      user_id: userId,
      post_id: postId
    });
  }

  async createVideoLike(userId, videoId) {
    await Like.create({
      user_id: userId,
      video_id: videoId
    });
  }

  async deletePostLike(userId, postId) {
    await Like.query()
      .where("user_id", userId)
      .where("post_id", postId)
      .delete();
  }

  async deleteVideoLike(userId, videoId) {
    await Like.query()
      .where("user_id", userId)
      .where("video_id", videoId)
      .delete();
  }

  async userLikesPost(userId, postId) {
    const userLikesPost = await Like.query()
      .where("user_id", userId)
      .where("post_id", postId)
      .getCount();

    return userLikesPost;
  }

  async userLikesVideo(userId, videoId) {
    const userLikesVideo = await Like.query()
      .where("user_id", userId)
      .where("video_id", videoId)
      .getCount();

    return userLikesVideo;
  }
}

module.exports = new LikeRepository();
