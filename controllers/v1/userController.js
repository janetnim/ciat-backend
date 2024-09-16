const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/user');
// import { User } from '../../models/user';

exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    // // Find user by email
    // const user = await User.findOne({ email });

    const user = await User.findOne({ where: { email: email } });
    // Check if user exists
    if (user) {
      return res.status(401).json({ message: 'User with with email already exists, please log in' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({...req.body, password: hashedPassword});

    return res.status(200).json({ message: 'User successfully signed up in, please log in' });
  } catch(error) {
    return res.status(500).json({ error: 'User sign-up failed. Please try again later' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email: email } });

    // Check if user exists and password matches
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token);
    return res.status(200).json({ token, user: user });
  } catch(error) {
    return res.status(500).json({ error: 'Login failed' });
  }
};
