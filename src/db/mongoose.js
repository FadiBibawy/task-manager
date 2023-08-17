const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/task-manager-api")
  .then(() => console.log("Connected!"));

const userSchema = new mongoose.Schema({ name: String, age: Number });
const User = mongoose.model("User", userSchema);

const taskSchema = new mongoose.Schema({
  description: String,
  completed: { type: Boolean, default: false },
});
const Task = mongoose.model("Task", taskSchema);
// mongoose.connection.dropCollection("tanks");

const fadi = new User({ name: "Fadi", age: "30" });
const task = new Task({ description: "First taks" });

task
  .save()
  .then(() => {
    console.log(task);
  })
  .catch((e) => {
    console.log(e);
  });
// fadi
//   .save()
//   .then(() => {
//     console.log(fadi);
//   })
//   .catch((e) => {
//     console.log(e);
//   });

User.find().then((users) => {
  console.log(users);
});

// const tanks = Tank.find({ name: "the second" });
// tanks.forEach((element) => {
//   console.log(element);
// });
// console.log(JSON.stringify(tanks));
