const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  order_history: [
    {
      order_time: {
        type: Date,
        default: Date.now
      },
      menu: [
        {
          id: { type: Schema.Types.ObjectId, required: true },
          name : {type : String, required: true},
          price : {type : Number, required: true},
          count: {
            type: Number,
            required: true
          }
        }
      ]
    }
  ],
  admin: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('User', userSchema);
