const express = require('express');
const app = express();

require('dotenv').config();
app.use(express.json());

const validateTweetLength = (req, res, next) => {
    const tweet = req.body.tweet;
    if (tweet.length > 100) {
        res.status(400).send("Tweet is too long");
    } else {
        next();
    }
};

const tweets = [
    {
      id: 1,
      user: "Evan",
      tweet: "Hello World!"
    },
    {
      id: 2,
      user: "Trump",
      tweet: "Build a wall!"
    }
]

app.get("/", (req, res) => {
  res.send("Hello World YAY!");
});

app.get("/api/tweets", (req, res) => {
  res.send(tweets);
});

app.get("/api/tweets/:user", (req, res) => {
   var target = tweets.find(t => t.user === req.params.user);
   if (!target) {
        res.status(404).send("The given user was not found");
   } else {
       res.send(target);
   }
});

app.post('/api/tweets', validateTweetLength, (req, res) => {

    var tweet = {
        id: tweets.length + 1,
        user: req.body.user,
        tweet: req.body.tweet
    }
    tweets.push(tweet);
    res.send(tweet);
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port ${port}`))