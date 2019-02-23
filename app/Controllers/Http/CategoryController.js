"use strict";
const UserRepository = use("App/Repositories/UserRepository");
const PostRepository = use("App/Repositories/PostRepository");
const CategoryRepository = use("App/Repositories/CategoryRepository");
const QuestionRepository = use("App/Repositories/QuestionRepository");
const SubscriptionRepository = use("App/Repositories/SubscriptionRepository");

class CategoryController {
  async index({ view, request, params, session }) {
    const user = await UserRepository.get(session.get("username"));
    const posts = await PostRepository.getPostsByCategoryPaginated(
      params.category_id,
      request.input("page", 1),
      10
    );
    const questions = await QuestionRepository.getQuestionsByCategoryPaginated(
      params.category_id,
      user.id,
      request.input("page", 1),
      10
    );
    const category = await CategoryRepository.get(params.category_id);
    const userIsSubscribed = await SubscriptionRepository.getSubscriptionByUser(
      user.id,
      params.category_id
    );

    return view.render("home", {
      posts: posts.toJSON(),
      questions: questions.toJSON(),
      category: category.toJSON(),
      userIsSubscribed: userIsSubscribed ? true : false,
      title: category.name
    });
  }

  async subscribe({ request, response, session }) {
    const user = await UserRepository.get(session.get("username"));

    const existingSubscription = await SubscriptionRepository.getSubscriptionByUser(
      user.id,
      request.input("category_id")
    );

    if (existingSubscription) {
      await SubscriptionRepository.deleteSubscription(
        user.id,
        request.input("category_id")
      );

      session.flash({
        notification: {
          type: "danger",
          message: "You have been unsubscribed from this Category!"
        }
      });
    } else {
      await SubscriptionRepository.create(
        user.id,
        request.input("category_id")
      );

      session.flash({
        notification: {
          type: "success",
          message: "Category subscription added!"
        }
      });
    }

    var route = "/category/" + request.input("category_id");
    return response.route(route);
  }

  async subscriptions({ view, request, session }) {
    const user = await UserRepository.get(session.get("username"));
    const subscriptions = await SubscriptionRepository.getSubscriptionsByUser(
      user.id
    );

    if (subscriptions.length > 0) {
      const posts = await PostRepository.getPostsByCategoriesPaginated(
        subscriptions,
        request.input("page", 1),
        10
      );

      const questions = await QuestionRepository.getQuestionsByCategoriesPaginated(
        subscriptions,
        user.id,
        1,
        10
      );

      return view.render("home", {
        posts: posts.toJSON(),
        questions: questions.toJSON(),
        message: "Subscribed"
      });
    } else {
      return view.render("home", {
        title: "My Subscriptions",
        message: "Subscribed"
      });
    }
  }
}

module.exports = CategoryController;
