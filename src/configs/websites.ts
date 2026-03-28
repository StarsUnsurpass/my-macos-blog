import type { WebsitesData } from "~/types";

const websites: WebsitesData = {
  favorites: {
    title: "SNS Links",
    sites: [
      {
        id: "apple",
        title: "Apple",
        img: "https://www.apple.com/favicon.ico",
        link: "https://www.apple.com"
      },
      {
        id: "my-blog",
        title: "Ace's Blog",
        img: "https://github.com/StarsUnsurpass.png",
        link: "https://github.com/StarsUnsurpass",
        inner: true
      },
      {
        id: "zhihu",
        title: "知乎",
        img: "img/sites/zhihu.jpeg",
        link: "https://www.zhihu.com"
      },
      {
        id: "bilibili",
        title: "B站",
        img: "img/sites/bilibili.svg",
        link: "https://www.bilibili.com"
      },
      {
        id: "youtube",
        title: "YouTube",
        img: "https://www.youtube.com/favicon.ico",
        link: "https://www.youtube.com"
      },
      {
        id: "twitter",
        title: "Twitter",
        img: "img/sites/twitter.svg",
        link: "https://www.twitter.com"
      },
      {
        id: "google",
        title: "Google",
        img: "https://www.google.com/favicon.ico",
        link: "https://www.google.com"
      },
      {
        id: "my-email",
        title: "Email",
        img: "img/sites/gmail.svg",
        link: "mailto:ace@example.com"
      }
    ]
  },
  freq: {
    title: "Frequently Visited",
    sites: [
      {
        id: "github",
        title: "Github",
        img: "img/sites/github.svg",
        link: "https://github.com/StarsUnsurpass"
      },
      {
        id: "arxiv",
        title: "arXiv",
        img: "img/sites/arxiv.png",
        link: "https://arxiv.org/"
      },
      {
        id: "twitter",
        title: "Twitter",
        img: "img/sites/twitter.svg",
        link: "https://www.twitter.com/"
      },
      {
        id: "dribbble",
        title: "Dribbble",
        img: "img/sites/dribbble.svg",
        link: "https://dribbble.com/"
      },
      {
        id: "pinterest",
        title: "Pinterest",
        img: "img/sites/pinterest.svg",
        link: "https://www.pinterest.com/"
      },
      {
        id: "art-station",
        title: "ArtStation",
        img: "img/sites/artstation.svg",
        link: "https://www.artstation.com//"
      },
      {
        id: "bilibili",
        title: "Bilibili",
        img: "img/sites/bilibili.svg",
        link: "https://www.bilibili.com/"
      },
      {
        id: "zhihu",
        title: "知乎",
        img: "img/sites/zhihu.jpeg",
        link: "https://www.zhihu.com/"
      },
      {
        id: "leetcode",
        title: "LeetCode",
        img: "img/sites/leetcode.svg",
        link: "https://leetcode.com/"
      },
      {
        id: "reddit",
        title: "Reddit",
        img: "img/sites/reddit.svg",
        link: "https://www.reddit.com/"
      },
      {
        id: "hacker-news",
        title: "Hacker News",
        img: "img/sites/hacker.svg",
        link: "https://news.ycombinator.com/"
      },
      {
        id: "v2ex",
        title: "V2EX",
        img: "https://www.v2ex.com/apple-touch-icon.png",
        link: "https://www.v2ex.com/"
      },
      {
        id: "aideadline",
        title: "AI Deadlines",
        img: "https://aideadlin.es/static/img/favicon.png",
        link: "https://aideadlin.es/",
        inner: true
      },
      {
        id: "oh-my-cv",
        title: "OhMyCV",
        img: "https://ohmycv.app/apple-touch-icon.png",
        link: "https://ohmycv.app/"
      },
      {
        id: "steam",
        title: "Steam",
        img: "img/sites/steam.svg",
        link: "https://store.steampowered.com/"
      },
      {
        id: "nazo",
        title: "Nazo",
        link: "https://nazo.one-story.cn"
      },
      {
        id: "svgomg",
        title: "SVGOMG",
        img: "https://jakearchibald.github.io/svgomg/imgs/icon.png",
        link: "https://github.com/StarsUnsurpass"
      },
      {
        id: "tiny-png",
        title: "Tiny PNG",
        img: "https://tinypng.com/images/panda-chewing-2x.png",
        link: "https://tinypng.com/"
      }
    ]
  }
};

export default websites;
