"use strict";
const Subscription = use("App/Models/Subscription");

class SubscriptionRepository {
  async getSubscriptionByUser(userId, categoryId) {
    return await Subscription.query()
      .where("user_id", userId)
      .where("category_id", categoryId)
      .first();
  }

  async getSubscriptionsByUser(userId){
    return await Subscription.query()
      .where("user_id", userId)
      .pluck("category_id");
  }

  async create(userId, categoryId){
    await Subscription.create({
      user_id: userId,
      category_id: categoryId
    });
  }

  async deleteSubscription(userId, categoryId){
    await Subscription.query()
      .where("user_id", userId)
      .where("category_id", categoryId)
      .delete();
  }
}

module.exports = new SubscriptionRepository();
