"use strict";

const User = use("App/Models/User");
const Category = use("App/Models/Category");
const Question = use("App/Models/Question");
const Badge = use("App/Models/Badge");

class QuestionSeeder {
  async run() {
    await this.seedUsers();
    await this.seedCategories();
    await this.seedQuestions();
    await this.seedBadges();
  }

  async seedUsers() {
    const users = [
      {
        username: "TestUser",
        email: "test@test.com",
        gravatar: "lol"
      }
    ];

    await User.createMany(users);
  }

  async seedCategories() {
    const categories = [
      {
        name: "C#"
      },
      {
        name: "JavaScript"
      }
    ];

    await Category.createMany(categories);
  }

  async seedQuestions() {
    const questions = [
      {
        user_id: 1,
        category_id: 1,
        title: "This is a question?",
        description:
          "This is the description of my question! So I'll elaborate here... Does anybody have an answer? Thanks"
      }
    ];

    await Question.createMany(questions);
  }

  async seedBadges() {
    const badge = {
      category_id: 1,
      title: "C# Expert",
      description: "A C# Expert."
    };

    var createdBadge = await Badge.create(badge);

    var user = await User.find(1);
    await user.badges().attach(createdBadge.id);
  }
}

module.exports = QuestionSeeder;
