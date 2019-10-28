const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.login = async (req, res, next) => {
  try {
    const checkEmail = await User.find({ email: req.body.email });
    if (!checkEmail.length) {
      return res.status(400).redirect('/login?error=nonemail');
    }
    const result = await bcrypt.compare(
      req.body.password,
      checkEmail[0].password
    );
    if (!result) {
      return res.status(400).redirect('/login?error=wrongpassword');
    } else {
      const tocken = jwt.sign(checkEmail[0].email, process.env.YOUR_SECRET_KEY);
      return res.status(200).redirect(`/?${tocken}`);
    }
  } catch (error) {
    return next(error);
  }
};

exports.signup = async (req, res, next) => {
  if(!req.body.password || !req.body.email || !req.body.password2){
    return res.status(400).redirect('/signup?error=badrequest');
  }
  try {
    const checkDupName = await User.find({ email: req.body.email });
    if (checkDupName.length) {
      return res.status(400).redirect('/signup?error=dupId');
    }
    if (req.body.password !== req.body.password2) {
      return res.status(400).redirect('/signup?error=wrongpassword');
    }
    const hash = await bcrypt.hash(req.body.password, bcrypt.genSaltSync(10));
    await User.create({
      email: req.body.email,
      password: hash
    });
    return res.status(302).redirect('/login');
  } catch (error) {
    if (error.name === 'CastError') {
      return next();
    } else {
      return next(error);
    }
  }
};

exports.checkAdmin = async (req, res, next) => {
  const email = jwt.verify(req.params.id, process.env.YOUR_SECRET_KEY);
  const userData = await User.find({ email: email });
  if (userData[0].admin) {
    return res.json({ email: email, admin: userData[0]._id });
  }
  return res.json({ email: email, admin: false });
};