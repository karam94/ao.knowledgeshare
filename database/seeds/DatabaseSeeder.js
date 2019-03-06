"use strict";

const User = use("App/Models/User");
const Category = use("App/Models/Category");
const Post = use("App/Models/Post");
const Video = use("App/Models/Video");
const Question = use("App/Models/Question");
const Badge = use("App/Models/Badge");
const Location = use("App/Models/Location");

class QuestionSeeder {
  async run() {
    await this.seedLocations();
    await this.seedUsers();
    await this.seedCategories();
    await this.seedQuestions();
    await this.seedBadges();
    await this.seedPosts();
    await this.seedVideos();
  }

  async seedLocations() {
    const locations = [
      {
        name: "5A Parklands, Bolton, United Kingdom"
      },
      {
        name: "5B Parklands, Bolton, United Kingdom"
      }
    ];

    await Location.createMany(locations);
  }

  async seedUsers() {
    const users = [
      {
        username: "Karam",
        email: "karam.kabbara@ao.com",
        gravatar: "b017d82484bc1b3d85dc114e8cc9ec37",
        description: "AO! Lets go!"
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
      },
      {
        name: "Raspberry Pi"
      },
      {
        name: "Go"
      },
      {
        name: "Architecture"
      }
    ];

    await Category.createMany(categories);
  }

  async seedQuestions() {
    const questions = [
      {
        user_id: 1,
        category_id: 1,
        title: "Posting JSON to REST Service C#?",
        description:
          "I am attempting to consume a Data source from Plex a cloud ERP System with Rest. Does anybody have an answer? Thanks"
      },
      {
        user_id: 1,
        category_id: 2,
        title:
          "Saving photo on local storage and displaying it on another page",
        description:
          "Basically I have page with images - under each one of them there is like button. When being liked, the image should be saved on localStorage and then displayed on another page."
      },
      {
        user_id: 1,
        category_id: 1,
        title: "C# JSON toObject switches day and month around",
        description:
          "I get a formatted string from the backend which looks like this: 2019-03-06T18:06:00. I can confirm this in debug in the first line of my included code."
      }
    ];

    await Question.createMany(questions);
  }

  async seedBadges() {
    const badge = {
      category_id: 1,
      title: "JavaScript Expert",
      description: "A JS Expert.",
      icon: "fab fa-js-square"
    };

    var createdBadge = await Badge.create(badge);

    var user = await User.find(1);
    await user.badges().attach(createdBadge.id);
  }

  async seedPosts() {
    const posts = [
      {
        user_id: 1,
        category_id: 3,
        author: "Karam Kabbara",
        title: "My Raspberry Pi Zero & the USB Audio Confusion",
        description:
          "So... I won a free Raspberry Pi Zero from Google! Then I bought some USB speakers for it and chaos ensued!",
        image:
          "https://www.raspberrypi.org/app/uploads/2017/05/Raspberry-Pi-Zero-1-1755x1080.jpg",
        url:
          "http://karam94.github.io/2019/My-Raspberry-Pi-Zero-and-the-USB-Audio-Confusion/"
      },
      {
        user_id: 1,
        category_id: 1,
        author: "Karam Kabbara",
        title: "A trick to clean up your .NET Web API controllers!",
        description:
          "Love clean looking code? Love C# & .NET? This might help!",
        image:
          "https://pbs.twimg.com/profile_images/531202538360414208/f_3aOvZe_400x400.png",
        url:
          "http://karam94.github.io/2019/A-trick-to-clean-up-your-NET-Web-API-controllers/"
      },
      {
        user_id: 1,
        category_id: 4,
        author: "Karam Kabbara",
        title: "The best thing since []bread?",
        description: "Our monthly challenge for November 2018 is complete...",
        image:
          "https://raw.githubusercontent.com/karam94/karam94.github.io/master/assets/images/karam-gopher.png",
        url:
          "http://karam94.github.io/2018/November-2018-Best-thing-since-bread/"
      },
      {
        user_id: 1,
        category_id: 5,
        author: "Karam Kabbara",
        title: "The Micro Frontend Conundrum",
        description: "When your frontend becomes a monolith...",
        image:
          "https://micro-frontends.org/ressources/diagrams/organisational/monolith-frontback-microservices.png",
        url: "http://karam94.github.io/2018/The-Micro-Frontend-Conundrum/"
      },
      {
        user_id: 1,
        category_id: 2,
        author: "Karam Kabbara",
        title: "AdonisJS, a match made in heaven?",
        description: "Discussing our challenge for December 2018...",
        image:
          "https://cdn-images-1.medium.com/max/1600/1*h13YbzArlrQwRSGi2CM9cA.png",
        url: "http://karam94.github.io/2018/AdonisJS-a-match-made-in-heaven/"
      }
    ];

    await Post.createMany(posts);
  }

  async seedVideos() {
    const videos = [
      {
        user_id: 1,
        category_id: 5,
        title: "Avoiding Microservice Megadisasters - Jimmy Bogard",
        description:
          "You’ve spent months re-architecting your monolith into the new microservices vision. Everyone gathers around to flip the switch. You navigate to the first pa...",
        image: "https://i.ytimg.com/vi/gfh-VCTwMw8/maxresdefault.jpg",
        url: "https://www.youtube.com/watch?v=gfh-VCTwMw8"
      },
      {
        user_id: 1,
        category_id: 1,
        title: "Abusing C# - Jon Skeet",
        description:
          "What language could be complete without some horrible abuse? If you can’t do terrible, evil things with it, how could you ever create works of great art? Of ...",
        image: "https://i.ytimg.com/vi/JIlO_EebEQI/maxresdefault.jpg",
        url: "https://www.youtube.com/watch?v=JIlO_EebEQI"
      },
      {
        user_id: 1,
        category_id: 2,
        title: "JavaScript Patterns for 2017 - Scott Allen",
        description:
          "The JavaScript language and ecosystem have seen dramatic changes in the last 2 years. In this sessions we’ll look at patterns for organizing code using modul...",
        image: "https://i.ytimg.com/vi/hO7mzO83N1Q/maxresdefault.jpg",
        url: "https://www.youtube.com/watch?v=hO7mzO83N1Q"
      }
    ];

    await Video.createMany(videos);
  }
}

module.exports = QuestionSeeder;
