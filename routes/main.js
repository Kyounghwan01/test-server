var express = require('express');
var router = express.Router();
const {
  login,
  signup,
  checkAdmin
} = require('../routes/controllers/authenticate');
const {
  changeSeats,
  sendCafeData,
  sendCafeDataToAll,
  choiceSeat,
  extendTime
} = require('./controllers/seat.controllers');
const {
  changeComplete,
  deleteMenu,
  makeNewMenu,
  changeMenuNameAndPrice
} = require('./controllers/order.controllers');
const { verifyToken } = require('./middleware/auth');

router.get('/view', sendCafeDataToAll);

router.get('/:id', checkAdmin);

router.get('/view/:id', verifyToken, sendCafeData);

router.post('/signup', signup);

router.post('/login', login);

router.post('/cafes/seats/:id', verifyToken, changeSeats);

router.post('/seats/:id', verifyToken, choiceSeat);

router.post('/extend/:id', verifyToken, extendTime);

router.post('/cafes/menu/:id', verifyToken, changeMenuNameAndPrice);

router.post('/cafes/menu/new/:id', verifyToken, makeNewMenu);

router.delete('/cafes/menu/:id', deleteMenu);

router.post(`/cafes/complete/:id`, verifyToken, changeComplete);

module.exports = router;
