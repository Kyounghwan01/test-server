const User = require('../../models/User');
const Cafes = require('../../models/Cafes');
const Category = require('../../models/Category');
const jwt = require('jsonwebtoken');
var moment = require('moment');

exports.changeSeats = async (req, res, next) => {
  try {
    const decoded = await jwt.verify(
      req.params.id,
      process.env.YOUR_SECRET_KEY
    );
    const objectId = await User.find({ email: decoded });
    const cafes = await Cafes.findOne({ owner: objectId[0]._id });
    cafes.arrangemenet = req.body.cafeArrange;
    await cafes.save();
    res.status(200).send({ status: 'success' });
  } catch (e) {
    res.status(500).send({ status: 'remote db server error' });
  }
};

exports.sendCafeData = async (req, res, next) => {
  try {
    const email = jwt.verify(req.params.id, process.env.YOUR_SECRET_KEY);
    const userData = await User.find({ email: email });
    const cafeData = await Cafes.findOne({});
    const categoryData = await Category.find({});
    return res.status(200).send({
      value: req.params.id,
      cafeData: cafeData,
      userData: userData,
      categoryData: categoryData
    });
  } catch (e) {
    res.status(500).send({ status: e });
  }
};

exports.sendCafeDataToAll = async (req, res, next) => {
  try {
    const cafeData = await Cafes.findOne({});

    for (let i = 0; i < cafeData.arrangemenet.length; i++) {
      if (cafeData.arrangemenet[i] && cafeData.arrangemenet[i].sittingTime) {
        if (
          moment().format('YYYY-MM-DDTHH:mm') >
          cafeData.arrangemenet[i].sittingTime
        ) {
          cafeData.arrangemenet[i] = {
            img:
              'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAT4AAACfCAMAAABX0UX9AAAAA1BMVEXi4uIvUCsuAAAASElEQVR4nO3BMQEAAADCoPVPbQ0PoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABODcYhAAEl463hAAAAAElFTkSuQmCC',
            order: 1,
            board: 'table',
            type: 'table',
            sittingTime: Date,
            userId: null
          };
        }
      }
    }

    await Cafes.findOneAndUpdate(
      {},
      { $set: { arrangemenet: cafeData.arrangemenet } }
    );
    res.status(200).send({ cafeData: cafeData });
  } catch (e) {
    res.status(500).send({ status: e });
  }
};

exports.choiceSeat = async (req, res, next) => {
  console.log(req.body);
  try {
    const email = jwt.verify(req.params.id, process.env.YOUR_SECRET_KEY);
    const userData = await User.findOne({email : email});
    const cafes = await Cafes.findOne({});

    cafes.arrangemenet = req.body.cafeArrange;
    //order에 정보틀리면 에러 보내라
    cafes.order.push({user : userData._id, user_name : userData.email, menu : req.body.order, created_at : 
      moment().format('YYYY-MM-DDTHH:mm')});

    userData.order_history.push({menu : req.body.order});

    await userData.save();
    await cafes.save();
    res.status(200).send({ status: 'success' });
  } catch (e) {
    res.status(500).send({ status: 'remote db server error' });
  }
};

exports.extendTime = async (req, res, next) => {
  const afterTwoHours = moment(Date.parse(new Date()) + 1000 * 60 * 120).format(
    'YYYY-MM-DDTHH:mm'
  );

  const cafeData = await Cafes.findOne({});
  cafeData.arrangemenet[req.body.index].sittingTime = afterTwoHours;
  await Cafes.findOneAndUpdate(
    {},
    { $set: { arrangemenet: cafeData.arrangemenet } }
  );

  res.status(200).send({ status: 'success', hour : afterTwoHours });
};
