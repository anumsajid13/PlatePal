const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
},
  username: {
    type: String,
    required: true,
    unique: true
},
email: {
    type: String,
    required: true,
    unique: true
},
password: {
    type: String,
    required: true,
},

profilePicture: {
    type: Buffer,
    validate: {
      validator: function (v) {   
        return /\.(png|jpg|jpeg)$/.test(v);
      },
      message: props => `${props.value} is not a valid image file. Please use PNG, JPG, or JPEG.`,
    },
  },
  address: String,
});

const Person = mongoose.model('Person', personSchema);

module.exports = Person;
