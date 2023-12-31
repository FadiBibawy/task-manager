const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Schema } = mongoose;

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
  tokens: [
    {
      token: {
        type: String,
      },
    },
  ],
  // tasks: [
  //   {
  //     type: Schema.Types.ObjectId,
  //     ref: "Task",
  //   },
  // ],
});

userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "owner",
});

userSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign({ _id: this._id.toString() }, "fadibibawyusertoken");
  this.tokens.push({ token });
  await this.save();
  return token;
};

userSchema.statics.checkUser = async function (email, password) {
  const user = await User.findOne({ email });
  const trueHashedPassword = user.password;
  const check = await bcrypt.compareSync(
    password.toString(),
    trueHashedPassword
  );
  return check;
};

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.tokens;

  return user;
};
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hashSync(this.password, 8);
  }
  next();
});
const User = mongoose.model("User", userSchema);

module.exports = User;
