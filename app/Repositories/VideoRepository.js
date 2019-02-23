"use strict";
const Video = use("App/Models/Video");

class VideoRepository {
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
}

module.exports = new VideoRepository();
