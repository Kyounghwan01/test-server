const User = require('../../models/User');
const Cafes = require('../../models/Cafes');
const Category = require('../../models/Category');
const jwt = require('jsonwebtoken');
var moment = require('moment');

exports.changeComplete = async (req, res, next) => {
  const changeData = await Cafes.findOne({});
  changeData.order.map((el, index) => {
    if (String(el._id) === req.body.id) {
      el.complete = true;
    }
  });
  await changeData.save();
  res.send({ status: 'success' });
};

exports.deleteMenu = async (req, res, next) => {
  try {
    const changeData = await Cafes.findOne({});

    let result = false;
    for (let i = 0; i < changeData.menu.length; i++) {
      if (String(changeData.menu[i]._id) === req.params.id) {
        result = changeData.menu[i].category;
        changeData.menu.splice(i, 1);
      }
    }
    if (!result) {
      return res
        .status(500)
        .send({ status: '잘못된 메뉴 id입니다 관리자에게 문의하세요' });
    } else {
      for (let i = 0; i < changeData.menu.length; i++) {
        if (String(changeData.menu[i].category) === String(result)) {
          result = false;
        }
      }
    }
    if (result) {
      await Category.findByIdAndRemove({ _id: result });
    }
    await changeData.save();
    return res.status(200).send({ status: 'success' });
  } catch (e) {
    res.status(500).send({ status: 'remote db server error' });
  }
};

exports.makeNewMenu = async (req, res, next) => {
  const cafes = await Cafes.findOne({});
  const category = await Category.find({});
  let price = Math.floor(req.body.price / 100) * 100;

  let answer = -1;
  for (let i = 0; i < category.length; i++) {
    if (category[i].name.indexOf(req.body.category) !== -1) {
      answer = i;
    }
  }
  if (answer !== -1) {
    cafes.menu.push({
      name: req.body.name,
      price: price,
      category: category[answer]._id,
      desc: req.body.desc
    });
    await cafes.save();
  } else {
    const newCategory = new Category({
      name: req.body.category
    });
    await newCategory.save();

    cafes.menu.push({
      name: req.body.name,
      price: price,
      category: newCategory._id,
      desc: req.body.desc
    });
    await cafes.save();
  }
  res.redirect(`/change/menu?${req.params.id}`);
};

exports.changeMenuNameAndPrice = async (req, res, next) => {
  let price = Math.floor(req.body.price / 100) * 100;
  const changeData = await Cafes.findOne({});
  changeData.menu.map(el => {
    if (el.id === req.body.id) {
      el.name = req.body.name;
      el.price = price;
      el.desc = req.body.desc;
    }
  });
  await changeData.save();
  res.status(200).send({ value: 'success' });
};
