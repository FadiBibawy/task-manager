const mongoose = require("mongoose");
const validator = require("validator");

mongoose
  .connect("mongodb://127.0.0.1:27017/task-manager-api")
  .then(() => console.log("Connected!"));

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
});
const User = mongoose.model("User", userSchema);

// Task Model
const taskSchema = new mongoose.Schema({
  description: { type: String, required: true },
  completed: { type: Boolean, default: false },
});
const Task = mongoose.model("Task", taskSchema);
// mongoose.connection.dropCollection("tanks");

const john = new User({
  name: "    john lastname     ",
  age: 20,
  email: "aasdjh@KSKD.CoM   ",
});
const task = new Task({ description: "second task" });

john
  .save()
  .then(() => {
    console.log(john);
  })
  .catch((e) => {
    console.log(e);
  });

// task
//   .save()
//   .then(() => {
//     console.log(task);
//   })
//   .catch((e) => {
//     console.log(e);
//   });

// User.find().then((users) => {
//   console.log(users);
// });

// const tanks = Tank.find({ name: "the second" });
// tanks.forEach((element) => {
//   console.log(element);
// });
// console.log(JSON.stringify(tanks));
