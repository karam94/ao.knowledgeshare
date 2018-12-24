"use strict";

class PostController {
  async create({ view }) {
    return view.render("post/create");
  }
}

module.exports = PostController;
