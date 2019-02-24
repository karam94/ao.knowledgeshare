"use strict";
const Video = use("App/Models/Video");

class VideoRepository {
  async get(id) {
    return await Video.query()
      .where("id", id)
      .with("category")
      .with("poster")
      // .with("likes")
      .with("comments.author")
      .firstOrFail();
  }

  async create(userId, categoryId, title, description, image, url) {
    await Video.create({
      user_id: userId,
      category_id: categoryId,
      title: title,
      description: description,
      image: image,
      url: url
    });
  }

  async getAllPaginated(page, limit) {
    return await Video.query()
      .orderBy("id", "desc")
      .with("category")
      .with("poster")
      // .with("likes")
      .with("comments")
      .paginate(page, limit);
  }
}

module.exports = new VideoRepository();
