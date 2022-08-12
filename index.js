const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const {
  // MONGO_USER,
  // MONGO_PASSWORD,
  // MONGO_IP,
  // MONGO_PORT,
  REDIS_URL,
  REDIS_PORT,
  SESSION_SECRET,
  MONGO_ATLAS_URL,
} = require('./config/config');

// redis stuff
const redis = require('redis');
const session = require('express-session');
let RedisStore = require('connect-redis')(session);
let redisClient = redis.createClient({
  legacyMode: true,
  url: `redis://${REDIS_URL}:${REDIS_PORT}`,
});
redisClient.connect().catch(console.error);
const postRouter = require('./routes/postRoutes');
const userRouter = require('./routes/userRoutes');

const port = process.env.PORT || 3000;

// const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

const mongoURL = MONGO_ATLAS_URL;

app.enable('trust proxy');

app.use(cors({}));

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: SESSION_SECRET,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 3000000000,
      // maxAge: 60000,
    },
  })
);

app.use(express.json());

const connectWithRetry = () => {
  // DB Connection
  mongoose
    .connect(mongoURL)
    .then(() => console.log('DB Connected! Yay!!'))
    .catch((err) => {
      console.log(err);
      setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();

app.get('/api/v1', (req, res) => {
  res.send('<h2>hello kuldeep!!</h2>');
  console.log('yeah it works!');
});

// posts
app.use('/api/v1/posts', postRouter);
// user/auth
app.use('/api/v1/user', userRouter);

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
