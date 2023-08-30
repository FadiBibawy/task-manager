const mongoose = require("mongoose");
const validator = require("validator");

// User Model

// Task Model
const taskSchema = new mongoose.Schema({
  description: { type: String, required: true },
  completed: { type: Boolean, default: false },
  owner: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});
const Task = mongoose.model("Task", taskSchema);
// mongoose.connection.dropCollection("tanks");

const task = new Task({ description: "second task" });

// john
//   .save()
//   .then(() => {
//     console.log(john);
//   })
//   .catch((e) => {
//     console.log(e);
//   });

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
const tasks = Task.find().then((tasks) => {
  // console.log(tasks);
  module.exports = tasks;
});

// const tanks = Tank.find({ name: "the second" });
// tanks.forEach((element) => {
//   console.log(element);
// });
// console.log(JSON.stringify(tanks));

module.exports = Task;
