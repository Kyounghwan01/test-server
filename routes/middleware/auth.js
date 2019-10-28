const jwt = require('jsonwebtoken');
const User = require('../../models/User');

async function verifyToken(req, res, next) {
  try {
    const decoded = await jwt.verify(req.params.id, process.env.YOUR_SECRET_KEY);
    const findUser = await User.find({email:decoded});
    if (!findUser.length) {
      throw new Error();
    }
    next();
  } catch (err) {
    res.json({ error: 'unauthorized' });
  }
}

exports.verifyToken = verifyToken;
