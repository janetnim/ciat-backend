const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/user');
// import * as tf from '@tensorflow/tfjs';

exports.batchProcess = async (req, res) => {
  console.log('????????????????', req.body);
  const { files } = req.body;

  // Find user by email
  const model = await tf.loadLayersModel('https://foo.bar/tfjs_artifacts/model.json');

  // Check if user exists and password matches
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  // Generate JWT token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res.cookie('token', token);

  res.redirect('/');
};
