const User = require('../models/userModel');
const bcryptjs = require('bcryptjs');

// sign up
exports.signUp = async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcryptjs.hash(password, 12);
    const newUser = await User.create({
      username: username,
      password: hashedPassword,
    });

    // provide session and login
    req.session.user = newUser;

    res.status(201).json({
      status: 'success',
      data: {
        user: newUser,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'failed',
    });
  }
};

// login

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({
        status: 'failed',
        message: 'User not found',
      });
    }

    const isCorrect = await bcryptjs.compare(password, user.password);

    if (isCorrect) {
      req.session.user = user;
      res.status(201).json({
        status: 'success',
      });
    } else {
      res.status(400).json({
        status: 'failed',
        message: 'Incorrect username or password',
      });
    }
  } catch (error) {
    res.status(400).json({
      status: 'failed',
    });
  }
};
