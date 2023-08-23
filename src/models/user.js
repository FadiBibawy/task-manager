const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

// User Model
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    require: true,
    lowercase: true,
    trim: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("the email is not valide");
      }
    },
  },
  name: { type: String, trim: true },
  // age: { type: Number, min: [2, "age must be more than 2"] },
  age: {
    type: Number,
    validate(value) {
      if (value <= 18) {
        throw new Error("You can not sign up while you are a minor!");
      }
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hashSync(this.password, 8);
  }
  next();
});
const User = mongoose.model("User", userSchema);

module.exports = User;
